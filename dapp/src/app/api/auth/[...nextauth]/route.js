// imports
import prisma from "@/app/helpers";
import NextAuth from "next-auth";
const API_URL = "YOUR_API_URL";

import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              username: { label: "Username", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const payload = {
                    email: credentials?.username, // Replace with the actual email
                    password: credentials?.password // Replace with the actual password
                };

                // const request = await axios.post(API_URL + 'user/login', payload);
                // const response = await request.data.data;
                // const user = await request.data.data;


                const user = await prisma.user.findFirst({
                  where: {
                    AND: [
                      { email: payload.email },
                      { password: payload.password }, // Certifique-se de que a senha está devidamente hashada
                    ],
                  },
                });

                console.log({user});

              if (user) {
                console.log("logged in")
                // Any object returned will be saved in `user` property of the JWT
                return { id: user.id, email: user.email };
              } else {
                // If you return null then an error will be displayed advising the user to check their details.
                return null
                
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
              }
            }
          })
    ],
    callbacks: {
        async jwt({ token, user }) {
          return { ...token, ...user };
        },
        secret: process.env.NEXTAUTH_SECRET,
        async session({ session, token, user }) {
          
          session.user = token;
          session.user.id = token.id;
      session.user.email = token.email;
          return session;
        },
      },
})

export { handler as GET, handler as POST }