import { useEffect, useState } from 'react';

import { Code } from '@inkandswitch/backchannel';

import useCountdown from '../hooks/useCountdown';
import { randomBytes } from 'crypto';

export enum CodeType {
  WORDS = 'words',
  NUMBERS = 'numbers',
}

/**
 * Get a connection code and its corresponding QR Code image string. Automatically refreshes every `refreshRateSec` seconds.
 *
 * @param {number} timeout The refresh rate in seconds. Default is 60 seconds.
 * @returns {Code} An invite code.
 */
export default function useCode(
  timeout: number = 60
): Code {
  const [code, setCode] = useState('');
  const [timeRemaining, resetCountdown] = useCountdown(timeout);

  // Generate new code and reset countdown when timer runs out
  // or if the codeType changes
  useEffect(() => {
    if (timeRemaining === 0) {
      // Clear the code before getting a new one so
      // stale codes don't linger
      setCode('');

      getCode().then((code) => {
        if (code) {
          setCode(code);
          resetCountdown();
        }
      });
    }
  }, [timeRemaining, resetCountdown, code]);

  // Generate new code if there isn't a code already.
  useEffect(() => {
    if (!code) {
      // Clear the code before getting a new one so
      // stale codes don't linger
      setCode('');

      getCode().then((code) => {
        if (code) {
          setCode(code);
          resetCountdown();
        }
      });
    }
  }, [code, resetCountdown]);

  return code;
}

const getCode = async (): Promise<Code> => {
  try {
    let random = randomBytes(3)
    let code = parseInt(Buffer.from(random).toString('hex'), 16)
    return code.toString();
  } catch (err) {
    if (err.message.startsWith('This code has expired')) {
      // TODO differentiate between an actual backend err (which should be displayed) vs the code timing out (which should happen quietly).
    } else {
      console.error('got error from backend', err);
    }
  }
};
