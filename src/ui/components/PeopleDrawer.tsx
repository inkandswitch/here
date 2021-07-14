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

type Props = {
  contacts: Array<IContact>;
  latestMessages: {};
};

export default function PeopleDrawer({ contacts, latestMessages }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

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
              {contacts.length === 0 && 'NO CONTACTS'}
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
                        {contact.id} - {latestMessageTime} TODO
                      </ListItem>
                    </Link>
                  );
                })}
              </UnorderedList>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
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
