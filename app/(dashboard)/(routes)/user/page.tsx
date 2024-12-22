import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";

import Box from "@/components/ui/box";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { NameForm } from "./_components/name-form";
import { EmailForm } from "./_components/email-form";
import { db } from "@/lib/db";
import { ContactForm } from "./_components/contact-form";

const ProfilePage = async () => {
  const {userId} = await auth()
  const user = await currentUser()

  if(!userId){
    redirect("/sign-in")
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId
    }
  })
  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">Profile Page
      <Box>
        <CustomBreadCrumb breadCrumbPage="My Profile"/>
      </Box>
      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
      {user && user.hasImage && (
        <div className="aspect-square w-24 h-24 rounded-full shadow-md ">
          <Image 
          fill
          className="w-full h-full object-cover"
          alt="User Profile Pic"
          src={user.imageUrl}
          />
          
        </div>
      ) }
      <NameForm initialData={profile} userId={userId}/>
      <EmailForm initialData={profile} userId={userId}/>
      <ContactForm initialData={profile} userId={userId}/>
      </Box>
    </div>
  )
}

export default ProfilePage;
