import { auth } from "@/auth";
import ProfileForm from "@/components/profile-form";

export default async function ProfilePage() {
    const session = await auth();

    if(!session?.user) {
        return null;
    }

    return (
        <ProfileForm 
            initialData = {{
                name: session.user.name ?? '',
                email: session.user.email ?? '',
                role: session.user.role ?? '',
                image: session.user.image ?? ''
            }}
        />
    )
}