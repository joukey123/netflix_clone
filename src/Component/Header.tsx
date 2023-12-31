import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 80px;
  top: 0;
  font-size: 16px;
  padding: 0 50px;
  box-sizing: border-box;
  z-index: 99;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  width: 100px;
  margin-right: 50px;
  align-items: center;
  height: 80px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 5px;
    stroke: white;
  }
`;
const Items = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;
const Search = styled.form`
  display: flex;
  align-items: center;
  position: relative;
`;
const Circle = styled(motion.div)`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.red};
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const Input = styled(motion.input)`
  position: absolute;
  left: -200px;
  padding: 10px 40px;
  outline: 0;
  border: 0;
  transform-origin: right center;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  color: rgba(255, 255, 255, 0.8);
  &::placeholder {
    font-size: 12px;
  }
`;
const logoVariants = {
  initial: {
    fillOpacity: 1,
  },
  hover: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};
const navVariants = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,1)",
  },
};

interface IForm {
  keyword: string;
}
function Header() {
  const navigate = useNavigate();
  const { register, handleSubmit, setFocus } = useForm<IForm>();
  const [searchOpne, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY, scrollYProgress } = useScroll();

  const onVaild = (data: IForm) => {
    navigate(`/search?keywords=${data.keyword}`);
  };

  useMotionValueEvent(scrollY, "change", () => {
    if (scrollY.get() > 80) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });
  // useEffect(() => {
  //   scrollY.on("change", () => {
  //     if (scrollY.get() > 80) {
  //       navAnimation.start("scroll");
  //     } else {
  //       navAnimation.start("top");
  //     }
  //   });
  // }, []);
  const toggleSearch = () => {
    if (searchOpne) {
      //close input
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      //open input
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
    setFocus("keyword");
  };

  return (
    <Nav variants={navVariants} initial={"top"} animate={navAnimation}>
      <Col>
        <Logo
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 276.742"
        >
          <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>
            <Link to="/">Home{homeMatch && <Circle layoutId="circle" />} </Link>
          </Item>
          <Item>
            <Link to="tv">
              Tv Show {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onVaild)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpne ? -188 : 0, zIndex: searchOpne ? 1 : 0 }}
            transition={{ type: "linear" }}
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 0 512 512"
          >
            <path
              fill="white"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="Search Movie or TvShow"
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
