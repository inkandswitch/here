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
} from '@chakra-ui/react';

export default function PeopleDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
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
            <UnorderedList>
              <ListItem>
                <Link>Rae</Link>
              </ListItem>
              <ListItem>
                <Link>Peter</Link>
              </ListItem>
              <ListItem>
                <Link>daiyi</Link>
              </ListItem>
            </UnorderedList>
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
