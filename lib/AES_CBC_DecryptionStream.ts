import {
  Aes,
  Cbc,
  FixedLengthUint8ArrayTransformStream,
  Padding,
} from "./deps.ts";

// TransformStream that decrypts an AES-CBC-crypted stream.
// This class uses the crypto third-party module to perform the decryption

export class AES_CBC_DecryptionStream
  extends FixedLengthUint8ArrayTransformStream {
  /**
   * Constructor
   * @param key - The key needed to decrypt the stream. Must be provided by the stream sender. The length of the key determines the complexity of the algorithm. For instance with a 16-byte key you get AES-CBC-128, with a 32-byte key you get AES-CBC-256...
   * @param padding - The padding method used during Encryption for the last chunk in case the length of the stream is not a multiple of 16. No padding if omitted. Use Padding object from the crypto deno third-party module.
   * @param iv - A 16-byte initialization vector. If omitted, the initialization vector is read from the first 16 bytes of the stream.
   */
  constructor(
    key: Uint8Array,
    padding?: Padding,
    iv?: Uint8Array,
  ) {
    let usedIv = iv;
    let nextIv: Uint8Array;
    super(iv === undefined ? 16 : 0, 16, true, (chunk) => {
      usedIv = chunk;
      return new Uint8Array();
    }, (chunk, eos) => {
      if (nextIv === undefined) nextIv = usedIv!;
      const decipher = new Cbc(
        Aes,
        key,
        nextIv,
        eos ? padding : undefined,
      );
      nextIv = chunk.slice(-16);
      return decipher.decrypt(chunk);
    }, () => {
      throw new Error("Input stream length should be multiple of 16.");
    });
  }
}
