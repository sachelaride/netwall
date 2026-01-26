import React, { useEffect, useRef } from 'react';

interface GuacamoleClientProps {
    connectionId: string;
    token?: string;
    serverUrl?: string; // e.g., http://your-guacamole-server:8080/guacamole
}

export function GuacamoleClient({ connectionId, token, serverUrl = 'http://localhost:8080/guacamole' }: GuacamoleClientProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Construct the URL
    // Standard format: /#/client/{idBase64}
    // If we have a token (HMAC/JSON auth), we append it ?token=...
    // The connectionId from DB needs to be Base64 encoded for the URL hash format usually:
    // "c" + connectionId (integer) -> Base64
    // Actually, standard Guacamole URL format for connection 1 is: /#/client/c/1
    // But usually it's encoded. Let's try the direct format if supported or just the encoding.
    // Encoded format: base64("c" + connectionId + "\0" + "c" + type) ?? 
    // Wait, simpler: The Guacamole client URL is usually `/#/client/{id}` where ID is a special string.
    // For a SQL connection ID '1', the client ID string is '1' type 'c'.
    // The URL hash is `base64(ID + \0 + TYPE + \0 + SOURCE)`.
    // Let's assume for now we just pass the raw ID and let the user navigate or use a simplified URL if possible.
    // Actually, easiest valid URL for connection '1' is typically:
    // `/#/client/c1` (c = connection, 1 = id) -> NO.

    // CORRECT FORMAT:
    // The ID string is `c` + database_id (e.g. `c1`).
    // This string must be Base64 encoded.
    // So for connection ID 1 -> "c1" -> Base64("c1") -> YzE=
    // URL: /#/client/YzE=

    const clientIdentifier = `c${connectionId}`;
    const encodedId = btoa(clientIdentifier).replace(/=/g, '');
    // Guacamole Base64 might strip padding? Standard B64 is usually fine.

    const src = `${serverUrl}/#/client/${encodedId}${token ? `?token=${token}` : ''}`;

    useEffect(() => {
        // Focus the iframe to capture keyboard input
        if (iframeRef.current) {
            iframeRef.current.focus();
        }
    }, []);

    return (
        <div className="w-full h-full flex flex-col bg-black">
            <iframe
                ref={iframeRef}
                src={src}
                className="w-full h-full border-0"
                allow="clipboard-read; clipboard-write"
                title="Remote Session"
            />
        </div>
    );
}
