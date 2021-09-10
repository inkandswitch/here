/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useCallback } from 'react';
import useCode  from '../hooks/useCode';
import { Key, ContactId } from 'backchannel';
import Backchannel from '../../backend';
import {
  Text,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from '@chakra-ui/react';
import ContactModalContent from './ContactModalContent';

const backchannel = Backchannel();

// Amount of seconds the user has to share code before it regenerates
const CODE_REGENERATE_TIMER_SEC = 120;

export default function CreateInviteButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const code = useCode(CODE_REGENERATE_TIMER_SEC);
  const [contactId, setContactId] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  // Generate a new code and wait for other party to enter the code.
  const redeemGeneratedCode = useCallback(async (code) => {
    const onError = (err: Error) => {
      console.error('got error from backend', err);
      setErrorMsg(err.message);
    };

    try {
      let nameplate = 'here+' + code.slice(0,2)
      let password = code.slice(2)
      const key: Key = await backchannel.accept(
        nameplate,
        password,
        (CODE_REGENERATE_TIMER_SEC + 2) * 1000 // be permissive, give extra time to redeem after timeout ends
      );

      const cid: ContactId = await backchannel.addContact(key);
      setContactId(cid);
      setErrorMsg('');
    } catch (err) {
      if (err.message.startsWith('This code has expired')) {
        // TODO differentiate between an actual backend err (which should be displayed) vs the code timing out (which should happen quietly).
      } else {
        onError(err);
      }
    }
  }, []);

  // join backchannel when code regenerates
  useEffect(() => {
    if (code.length > 0) {
      redeemGeneratedCode(code);
    }
  }, [code, redeemGeneratedCode]);

  const closeModal = () => {
    setContactId('');
    onClose();
  };

  return (
    <>
      <Button variant="outline" onClick={onOpen}>
        Create invite
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
              <Text>
                Your friend should redeem this code to link you as a contact:
              </Text>
              <Text fontSize="4xl">{code}</Text>
              <Text color="tomato">{errorMsg}</Text>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
