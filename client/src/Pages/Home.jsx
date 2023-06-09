
import DontMiss from "../components/DontMiss";
import Feature from "../components/Feature";
import Latest from "../components/Latest";
import Trending from "../components/Trending";
import useAuth from "../hooks/useAuth";
import useScrollToTop from "../hooks/useScrollToTop";
import useTitle from "../hooks/useTitle";


const Home = () => {
  const { id } = useAuth();
  useTitle("Home")
  useScrollToTop();

  return (
    <>
      <main className="max-w-7xl w-full mx-auto px-1 md:px-4">
        <Feature />
        {id && (
          <>
            <DontMiss />
            <Trending />
            <Latest />
          </>
        )}
      </main>
    </>
  );
};

export default Home;
