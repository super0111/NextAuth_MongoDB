import Image from "next/image";

export default function CamAntPreview({streamId}) {
    return (
        <div>
            <div>
                <Image src={`https://${process.env.NEXT_PUBLIC_MEDIA_SERVER_DOMAIN}:${process.env.NEXT_PUBLIC_MEDIA_SERVER_SECURE_PORT}/WebRTCAppEE/previews/${streamId}.png`} alt="Image Preview" />
            </div>
            
        </div>
    )
}
