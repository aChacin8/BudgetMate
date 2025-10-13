import sodium from 'libsodium-wrappers';

export class SecureData {
    private static key: Uint8Array;

    static async init(secretKey: string) {
        await sodium.ready;
        this.key = sodium.crypto_generichash(32, secretKey);
    }

    static encrypt(plainText: string): string {
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES); 
        const cipher = sodium.crypto_secretbox_easy(plainText, nonce, this.key);
        return `${sodium.to_base64(nonce)}:${sodium.to_base64(cipher)}`; // Store nonce and cipher together
    }

    static decrypt(cipherText: string): string {
        const [nonceB64, cipherB64] = cipherText.split(':'); 
        const nonce = sodium.from_base64(nonceB64);
        const cipher = sodium.from_base64(cipherB64);
        const decrypted = sodium.crypto_secretbox_open_easy(cipher, nonce, this.key);

        if (!decrypted) throw new Error('Invalid ciphertext or key');
        return sodium.to_string(decrypted);
    }
}

