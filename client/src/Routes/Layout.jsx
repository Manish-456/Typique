import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import usePrefetch from "../Features/auth/Prefetch";
import useAuth from "../hooks/useAuth";
import { SocketContext } from "../context/socketContext";
import { useSendMailMutation } from "../Features/auth/authApiSlice";
import { Toaster, toast } from "react-hot-toast";
const Layout = () => {
  usePrefetch();
  const [email, setEmail] = useState("");
  const { id, username } = useAuth();
  const { socket } = useContext(SocketContext);

  const [sendMail] = useSendMailMutation();

  useEffect(() => {
    if (id) {
      socket?.emit("register", { id: id });
    }
  }, [id]);

  useEffect(() => {
    if (!email) return;
    const handleSendMail = async () => {
      try {
      const {data} =  await sendMail({
          username,
          email,
          text: ` Welcome to Typique! We're thrilled to have you as part of our community of readers and subscribers. Thank you for signing up to receive our blog updates.
        As a subscriber, you'll be the first to know about our latest blog posts, news, and updates. Wecover topics related to Science and technology, fitness, entertainment, lifestyle and many more. We also offer exclusive content and special promotions just for our subscribers, so be sure to keep an eye out for those.
        We encourage you to engage with our blog by leaving comments and sharing your thoughts and feedback with us. We value your input and love hearing from our readers.
       we hope you'll stick around and join us for many more blog posts to come.
        Thank you again for subscribing to Typique. We look forward to sharing our content with you! `,
          subject: "Subscription Successful",
        });
       toast.success(data?.msg)

      } catch (error) {
    
      }
    };

    email && handleSendMail()

   
  }, [email]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Outlet />

      <Footer setEmail={setEmail} id={id} />
    </>
  );
};

export default Layout;
