import {
  Aes,
  Cbc,
  concat,
  FixedLengthUint8ArrayTransformStream,
  Padding,
} from "./deps.ts";

// TransformStream that encrypts a stream according to the AES-CBC algorithm.
// This class uses the crypto third-party module to perform the encryption
export class AES_CBC_EncryptionStream
  extends FixedLengthUint8ArrayTransformStream {
  /**
   * Constructor
   * @param key - The key needed to encrypt the stream. Must be provided to the receiver. The length of the key determines the complexity of the algorithm. For instance with a 16-byte key you get AES-CBC-128, with a 32-byte key you get AES-CBC-256...
   * @param padding - The padding method to be used in case the length of the stream is not a multiple of 16. No padding if omitted. Use Padding object from the crypto deno third-party module.
   * @param iv - A 16-byte initialization vector. Must be provided to the receiver unless addIVAtStreamStart is true.
   * @param addIVAtStreamStart - If true, the initialization vector is added at the start of the encoded stream.
   */
  constructor(
    key: Uint8Array,
    padding: Padding,
    iv: Uint8Array,
    addIVAtStreamStart: boolean,
  ) {
    let nextIv = iv;
    let firstChunk = true;
    super(0, 16, true, (chunk) => {
      return chunk;
    }, (chunk) => {
      const cipher = new Cbc(
        Aes,
        key,
        nextIv,
      );
      let encryptedChunk = cipher.encrypt(chunk);
      nextIv = encryptedChunk.slice(-16);
      if (firstChunk) {
        if (addIVAtStreamStart) encryptedChunk = concat(iv, encryptedChunk);
        firstChunk = false;
      }

      return encryptedChunk;
    }, (chunk) => {
      const cipher = new Cbc(
        Aes,
        key,
        nextIv,
        padding,
      );
      return cipher.encrypt(chunk);
    });
  }
}
