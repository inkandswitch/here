/** @jsxImportSource @emotion/react */
import React from 'react';
import { Stack } from '@chakra-ui/react';

import { ContactId, IContact } from '@inkandswitch/backchannel';

import PeopleDrawer from './PeopleDrawer';
import Map from './Map';
import CreateInviteButton from './CreateInviteButton';
import RedeemCodeButton from './RedeemCodeButton';

type Props = {
  contacts: Array<IContact>;
  latestMessages: {};
  contactId?: ContactId;
  sidebarOpen?: boolean;
};

export default function MapAndViews({
  contactId,
  contacts,
  latestMessages,
  sidebarOpen = false,
}: Props) {
  return (
    <>
      <Map />
      <Stack spacing={4} direction="row" align="center">
        <CreateInviteButton />
        <RedeemCodeButton />
        <PeopleDrawer
          contacts={contacts}
          latestMessages={latestMessages}
          contactId={contactId}
          initialOpen={sidebarOpen}
        />
      </Stack>
    </>
  );
}
