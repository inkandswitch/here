import React from 'react';
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
  Link,
  UnorderedList,
  ListItem,
  Box,
} from '@chakra-ui/react';
import { IContact } from '../../backend/types';
import Backchannel from '../../backend';
import Nickname from './Nickname';

const backchannel = Backchannel();

type Props = {
  contacts: Array<IContact>;
  latestMessages: {};
};

export default function PeopleDrawer({ contacts, latestMessages }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

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

  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        Where?
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Here.</DrawerHeader>
          <DrawerBody>
            <Box>
              {contacts.length === 0 && 'No contacts. Where are your peeps at?'}
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
                    <Link key={contact.id}>
                      <ListItem>
                        <Nickname contact={contact} /> {latestMessageTime}
                      </ListItem>
                    </Link>
                  );
                })}
              </UnorderedList>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={handleResetClick}
            >
              Delete all data
            </Button>
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
