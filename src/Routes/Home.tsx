import { useQuery } from "react-query";
import { IMoviesData, getMovies, getTop } from "../api";
import styled from "styled-components";
import { imgApi } from "../units";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";
import { useMatch, useNavigate } from "react-router-dom";

const Wapper = styled.div`
  background-color: black;
  height: 150vh;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner = styled.div<{ $bgImg: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImg});
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
`;

const Title = styled.h3`
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;
const Row = styled(motion.div)`
  display: grid;
  padding: 50px;
  box-sizing: border-box;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 200px;
  position: absolute;
`;

const Box = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  background-color: ${(props) => props.theme.white.darker};
  font-size: 20px;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 5px;
  font-size: 16px;
  text-align: center;
  background-color: ${(props) => props.theme.black.darker};
  position: absolute;
  width: 100%;
  bottom: 0;
  opacity: 0;
  box-sizing: border-box;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
`;

const NowPlay = styled(motion.div)`
  position: fixed;
  top: 150px;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  height: 65vh;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 15px;
  overflow: hidden;
`;
const Img = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 400px;
`;
const NowPlayTitle = styled.h2`
  position: relative;
  top: -60px;
  padding: 15px;
  font-size: 30px;
  font-weight: bold;
`;
const NowPlayDec = styled.p`
  position: relative;
  top: -60px;
  padding: 15px;
  font-size: 18px;
`;

const boxVariants = {
  nomal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const offset = 6;

function Home() {
  const width = useWindowDimensions();
  const navigate = useNavigate();
  const modalBoxMatch = useMatch("movies/:id");
  const { data: topData, isLoading: popularLoading } = useQuery<IMoviesData>(
    ["popularMovies", "popular"],
    getTop
  );
  const { data: nowPlayData, isLoading: nowPlayLoading } =
    useQuery<IMoviesData>(["movies", "nowPlaying"], getMovies);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isPre, setIsPre] = useState(false);

  const onClickBox = (moviId: number) => {
    navigate(`/movies/${moviId}`);
  };

  const onClickOverlay = () => navigate(-1);

  const clickedMovie =
    modalBoxMatch?.params.id &&
    nowPlayData?.results.find(
      (movie) => movie.id + "" === modalBoxMatch?.params.id
    );

  const increaseIndex = () => {
    if (nowPlayData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = nowPlayData?.results.length - 1; //19
      const maxIndex = Math.floor(totalMovie / offset) - 1; //2
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setIsPre(false);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  // const randomNumber = Math.floor(
  //   Math.random() * (data?.results.length as number)
  // );
  return (
    <Wapper>
      {nowPlayLoading ? (
        <Loader> Loading... </Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgImg={imgApi(nowPlayData?.results[0].backdrop_path || "")}
          >
            <Title> {nowPlayData?.results[0].title}</Title>
            <Overview> {nowPlayData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: isPre ? -width : width }}
                animate={{ x: 0 }}
                exit={{ x: isPre ? width : -width }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlayData?.results
                  .slice(1)
                  .slice(index * offset, offset * (index + 1))
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onClickBox(movie.id)}
                      variants={boxVariants}
                      whileHover={"hover"}
                      transition={{ type: "tween" }}
                      key={movie.id}
                      $bgImg={imgApi(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}> {movie.title}</Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {modalBoxMatch ? (
              <>
                <Overlay
                  onClick={onClickOverlay}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <NowPlay
                  exit={{ opacity: 0 }}
                  layoutId={modalBoxMatch.params.id}
                >
                  {clickedMovie && (
                    <>
                      <Img
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent), url(${imgApi(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></Img>
                      <NowPlayTitle>{clickedMovie.title}</NowPlayTitle>
                      <NowPlayDec>{clickedMovie.overview}</NowPlayDec>
                    </>
                  )}
                </NowPlay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wapper>
  );
}

export default Home;
