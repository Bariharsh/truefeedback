import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}


// const identifier = credentials?.email || credentials?.name; 
//         const password = credentials?.password;

//         if (!identifier || !password) {
//           throw new Error("Email/Username and Password are required");
//         }

//         const user = await UserModel.findOne({
//           $or: [{ email: identifier }, { username: identifier }],
//         });

//         if (!user) throw new Error("User not found");

//         if (!user.isVerified) {
//           throw new Error("User is not verified. Please verify your account.");
//         }

//         const isPasswordCorrrect = await bcrypt.compare(
//           password,
//           user.password
//         );
//         if (!isPasswordCorrrect) {
//           throw new Error("Invalid password");
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           isVerified: user.isVerified,
//           isAcceptingMessages: user.isAcceptingMessages,
//           username: user.username,
//         };



// const router = useRouter();

//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof signInSchema>) => {

//     const result = await signIn("credentials", {
//       redirect: false,
//       callbackUrl: "/dashboard",
//       identifier: data.identifier,
//       password: data.password,
//     });

//     if (result?.error) {
//       if (result.error === "CredentialsSignin") {
//         toast.error("Login failed. Invalid email/username or password.");
//       } else {
//         toast.error(result.error);
//       }
//     }

//     if (result?.ok && result.url) {
//       router.replace(result.url);
//     }
//   };