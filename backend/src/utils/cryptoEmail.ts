import sodium from 'libsodium-wrappers';

export class CryptoEmail {
    private static key: Uint8Array;

    static async init() {
        await sodium.ready;
        if (!process.env.ENCRYPT_KEY) {
            throw new Error('Encrypt key is not defined');
        }

        this.key = sodium.from_base64(
            process.env.ENCRYPT_KEY,
            sodium.base64_variants.ORIGINAL
        );
    }

    static encryptEmail(email: string) {
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        const ciphertext = sodium.crypto_secretbox_easy(email, nonce, this.key);
        return {
            encrypted: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
            nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
        };
    }

    static decryptEmail(encrypted: string, nonce: string) {
        const decrypted = sodium.crypto_secretbox_open_easy(
            sodium.from_base64(encrypted, sodium.base64_variants.ORIGINAL),
            sodium.from_base64(nonce, sodium.base64_variants.ORIGINAL),
            this.key
        );
        if (!decrypted) throw new Error('Invalid key or nonce');
        return sodium.to_string(decrypted);
    }
}
