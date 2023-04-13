# Introduction
aes_cbc_crypto_stream is a DENO open-source library (MIT license) that codes and decodes streams according to the AES CBC algorithm.
This package is not to be used any more. Please use deno_simple_utilities instead.

# API
## class AES_CBC_DecryptionStream extends FixedLengthUint8ArrayTransformStream
### Constructor
#### @param key
The key needed to decrypt the stream. Must be provided by the stream sender. The length of the key determines the complexity of the algorithm. For instance with a 16-byte key you get AES-CBC-128, with a 32-byte key you get AES-CBC-256...

#### @param padding
The padding method used during Encryption for the last chunk in case the length of the stream is not a multiple of 16. No padding if omitted. Use Padding object from the crypto deno third-party module.

#### @param iv
A 16-byte initialization vector. If omitted, the initialization vector is read from the first 16 bytes of the stream.

## class AES_CBC_EncryptionStream extends FixedLengthUint8ArrayTransformStream
### Constructor
#### @param key
The key needed to encrypt the stream. Must be provided to the receiver. The length of the key determines the complexity of the algorithm. For instance with a 16-byte key you get AES-CBC-128, with a 32-byte key you get AES-CBC-256...

#### @param padding
The padding method to be used in case the length of the stream is not a multiple of 16. No padding if omitted. Use Padding object from the crypto deno third-party module.

#### @param iv
A 16-byte initialization vector. Must be provided to the receiver unless addIVAtStreamStart is true.

#### @param addIVAtStreamStart
If true, the initialization vector is added at the start of the encoded stream.

# Example
```ts
import { Padding } from "https://deno.land/x/crypto@v0.10.0/block-modes.ts";
import {
  AES_CBC_DecryptionStream,
  AES_CBC_EncryptionStream,
} from "https://deno.land/x/aes_cbc_crypto_stream/mod.ts";
import { readableStreamFromIterable } from "std/streams/readable_stream_from_iterable.ts";

const te = new TextEncoder();
const td = new TextDecoder();

const key = te.encode("SuperDuperSecretSuperDuperSecret");
const iv = te.encode("HushItsASecret!!");

const story = "A short story. It's just an example!";
const data = te.encode(story);

const testStream = readableStreamFromIterable([data]);
const encryptedStream = testStream.pipeThrough(
  new AES_CBC_EncryptionStream(key, Padding.PKCS7, iv, true),
);
const decryptedStream = encryptedStream.pipeThrough(
  new AES_CBC_DecryptionStream(key, Padding.PKCS7),
);
let decryptedText = "";
for await (const chunk of decryptedStream) decryptedText += td.decode(chunk);

console.log(decryptedText);
```

This code is available at https://github.com/martinjeromelouis/AES_CBC_CryptoStream/blob/master/examples/examples.ts.

# Tests
See https://github.com/martinjeromelouis/FixedLengthUint8ArrayTransformStream/blob/master/tests/FixedLengthUint8ArrayTransformStream_test.ts

# License
MIT
