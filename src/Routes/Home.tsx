import { useQuery } from "react-query";
import { IMoviesData, getMovies } from "../api";
import styled from "styled-components";
import { imgApi } from "../units";

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

const Banner = styled.div<{ bgImg: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImg});
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

function Home() {
  const { data, isLoading } = useQuery<IMoviesData>(
    ["movies", "nowPlaying"],
    getMovies
  );
  return (
    <Wapper>
      {isLoading ? (
        <Loader> Loading... </Loader>
      ) : (
        <>
          <Banner bgImg={imgApi(data?.results[0].backdrop_path || "")}>
            <Title> {data?.results[0].title}</Title>
            <Overview> {data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wapper>
  );
}

export default Home;
