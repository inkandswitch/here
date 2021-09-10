/** @jsxImportSource @emotion/react */
import React, { useState, useCallback } from 'react';

import { Key, ContactId } from 'backchannel';
import {
  Text,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  Input,
  FormControl,
  useDisclosure,
} from '@chakra-ui/react';
import Backchannel from '../../backend';
import ContactModalContent from './ContactModalContent';

const backchannel = Backchannel();

export default function RedeemCodeButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [code, setCode] = useState('');
  const [contactId, setContactId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const redeemCode = useCallback(async (code) => {
    const onError = (err: Error) => {
      console.error(err);

      setErrorMsg(err.message);
    };

    try {
      let nameplate = 'here+' + code.slice(0,2)
      let password = code.slice(2)
      const key: Key = await backchannel.accept(nameplate, password);

      const cid: ContactId = await backchannel.addContact(key);
      setErrorMsg('');
      setCode('');
      setContactId(cid);
    } catch (err) {
      console.log('got error', err);
      onError(err);
      setCode('');
    }
  }, []);

  function handleInputChange(event) {
    setErrorMsg('');
    setCode(event.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await redeemCode(code);
  }

  const closeModal = () => {
    setContactId('');
    onClose();
  };

  return (
    <>
      <Button variant="outline" onClick={onOpen}>
        Redeem Code
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {contactId ? (
          <ContactModalContent contactId={contactId} closeModal={closeModal} />
        ) : (
          <ModalContent>
            <ModalHeader>Temporary invite code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb="8px">
                Enter your friend's temporary invite code to link with them:
              </Text>
              <FormControl id="code-input">
                <Input
                  value={code}
                  placeholder="Enter the code"
                  onChange={handleInputChange}
                  autoFocus
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                form="code-input"
                variant="solid"
                isDisabled={code.length === 0}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Text color="tomato">{errorMsg}</Text>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
