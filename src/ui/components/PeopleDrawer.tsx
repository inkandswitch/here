import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  useDisclosure,
  Drawer,
  Button,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Link as A,
  UnorderedList,
  ListItem,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ContactId, IContact } from '@inkandswitch/backchannel';
import Backchannel from '../../backend';
import Nickname from './Nickname';

const backchannel = Backchannel();

type Props = {
  contacts: Array<IContact>;
  latestMessages: {};
  contactId?: ContactId;
  initialOpen?: boolean;
};

export default function PeopleDrawer({
  contactId,
  contacts,
  latestMessages,
  initialOpen = false,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: initialOpen,
  });
  const [contact, setContact] = useState<IContact>();
  let [, setLocation] = useLocation();
  const btnRef = React.useRef();

  useEffect(() => {
    if (contactId && contactId !== contact?.id) {
      setContact(backchannel.db.getContactById(contactId));
    }
  }, [contactId, contact]);

  function handleResetClick(e) {
    e.preventDefault();
    if (
      window.confirm(
        'Remove all of your data and contacts? you will have to find your people again.'
      )
    ) {
      backchannel.destroy().catch((err) => {
        console.error('error clearing db', err);
      });
      window.location.href = '';
    }
  }

  async function handleContactDelete(e) {
    e.preventDefault();
    if (window.confirm('Permanently delete this contact?')) {
      await backchannel.deleteContact(contact.id);
      setLocation(`/`);
    }
  }

  function handleClose() {
    setLocation('/');
    onClose();
  }

  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        Where?
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Here.</DrawerHeader>
          <DrawerBody>
            {contact ? (
              <Stack spacing={4}>
                <Heading as="h5">
                  <Nickname contact={contact} />
                </Heading>
                <Text>❌ Can see your location</Text>
                <Text>❌ Sharing their location with you</Text>
              </Stack>
            ) : (
              <>
                {contacts.length === 0 &&
                  'No contacts. Where are your peeps at?'}
                <UnorderedList>
                  {contacts.map((contact) => {
                    let latestMessage, latestMessageTime;
                    if (latestMessages && latestMessages[contact.id]) {
                      latestMessage = latestMessages[contact.id];
                      latestMessageTime = timestampToDate(
                        latestMessage.timestamp
                      );
                    }

                    return (
                      <ListItem key={contact.id}>
                        <Link href={`/contact/${contact.id}`}>
                          <A>
                            <Nickname contact={contact} /> {latestMessageTime}
                          </A>
                        </Link>
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </>
            )}
          </DrawerBody>
          <DrawerFooter>
            {contact ? (
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleContactDelete}
              >
                Delete Contact
              </Button>
            ) : (
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleResetClick}
              >
                Delete all data
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// TODO use moment or semantic datestamp tool
function timestampToDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString();
}
