/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Route } from 'wouter';
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  Stack,
} from '@chakra-ui/react';

import Backchannel from '../backend';
import Automerge from 'automerge';
import { Mailbox, IMessage, EVENTS } from 'backchannel';

import PeopleDrawer from './components/PeopleDrawer';
import Map from './components/Map';
import CreateInviteButton from './components/CreateInviteButton';
import RedeemCodeButton from './components/RedeemCodeButton';

const backchannel = Backchannel();

function App() {
  const [askedLocation, setAskedLocation] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [latestMessages, setLatestMessages] = useState([]);

  useEffect(() => {
    function refreshContactList() {
      const contacts = backchannel.listContacts();
      setContacts(contacts);

      contacts.forEach(async (contact) => {
        let messages = await backchannel.getMessagesByContactId(contact.id);

        if (!messages) {
          const doc = (await backchannel._addContactDocument(
            contact
          )) as Automerge.Doc<Mailbox>;
          messages = doc.messages;
        }
        const lastMessage: IMessage = messages[messages.length - 1];
        setLatestMessages((latestMessages) => ({
          ...latestMessages,
          [contact.id]: lastMessage,
        }));
      });
    }

    refreshContactList();

    backchannel.on(EVENTS.CONTACT_DISCONNECTED, refreshContactList);
    backchannel.on(EVENTS.CONTACT_CONNECTED, refreshContactList);
    backchannel.on(EVENTS.MESSAGE, refreshContactList);
    return function unsub() {
      backchannel.removeListener(
        EVENTS.CONTACT_DISCONNECTED,
        refreshContactList
      );
      backchannel.removeListener(EVENTS.CONTACT_CONNECTED, refreshContactList);
      backchannel.removeListener(EVENTS.MESSAGE, refreshContactList);
    };
  }, []);

  function success(pos) {
    var crd = pos.coords;

    let message = JSON.stringify(crd);
    console.log(message);

    // TODO send message to backend
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  useEffect(() => {
    if (!askedLocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      const id = navigator.geolocation.watchPosition(success, error, options);
      setAskedLocation(true);

      return () => navigator.geolocation.clearWatch(id);
    }
  }, [askedLocation, setAskedLocation]);

  const theme = extendTheme(withDefaultColorScheme({ colorScheme: 'purple' }));

  return (
    <ChakraProvider theme={theme}>
      <Map />
      <Stack spacing={4} direction="row" align="center">
        <CreateInviteButton />
        <RedeemCodeButton />
        <Route path="/contact/:cid">
          {(params) => (
            <PeopleDrawer
              contacts={contacts}
              latestMessages={latestMessages}
              contactId={params.cid}
              initialOpen
            />
          )}
        </Route>
        <Route path="/">
          <PeopleDrawer contacts={contacts} latestMessages={latestMessages} />
        </Route>
      </Stack>
    </ChakraProvider>
  );
}

export default App;
