/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { IContact } from '../../backend/types';

export default function Nickname({ contact }: { contact: IContact }) {
  if (contact.moniker) {
    return <>{contact.moniker}</>;
  }

  // No nickname was ever assigned, show placeholder
  return (
    <span
      css={css`
        color: gray;
        font-style: italic;
      `}
    >
      No name
    </span>
  );
}
