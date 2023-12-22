import { useQuery } from "react-query";
import { IMoviesData, getMovies } from "../api";
import styled from "styled-components";
import { imgApi } from "../units";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowDimensions from "../useWindowDimensions";

const Wapper = styled.div`
  background-color: black;
  height: 200vh;
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
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
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

  const { data, isLoading } = useQuery<IMoviesData>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovie = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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
      {isLoading ? (
        <Loader> Loading... </Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgImg={imgApi(data?.results[0].backdrop_path || "")}
          >
            <Title> {data?.results[0].title}</Title>
            <Overview> {data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: width + 5 }}
                animate={{ x: 0 }}
                exit={{ x: -width - 5 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(index * offset, offset * (index + 1))
                  .map((movie) => (
                    <Box
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
        </>
      )}
    </Wapper>
  );
}

export default Home;
