/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { ContactId } from 'backchannel';
import {
  Text,
  ModalHeader,
  ModalBody,
  Button,
  ModalContent,
  FormControl,
  FormLabel,
  ModalFooter,
  Input,
} from '@chakra-ui/react';

import Backchannel from '../../backend';

const backchannel = Backchannel();

type Props = {
  contactId: ContactId;
  closeModal: () => void;
};

export default function ContactModalContent({ contactId, closeModal }: Props) {
  const [nickname, setNickname] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  function handleInputChange(event) {
    setErrorMsg('');
    setNickname(event.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    try {
      await backchannel.editName(contactId, nickname);
      closeModal();
    } catch (err) {
      console.error(err);
      setErrorMsg(err);
    }
  }

  return (
    <ModalContent>
      <ModalHeader>Linking with friend</ModalHeader>
      <ModalBody>
        <Text mb="4">We found them!</Text>
        <FormControl id="code-input">
          <FormLabel>Contact Nickname</FormLabel>
          <Input
            value={nickname}
            placeholder="what do you call your friend?"
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
          isDisabled={nickname.length === 0}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Text color="tomato">{errorMsg}</Text>
      </ModalFooter>
    </ModalContent>
  );
}
