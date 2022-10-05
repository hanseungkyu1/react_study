import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { createContext, lazy, Suspense, useEffect, useState } from 'react';
import data from './data';
import { Routes, Route, Link, useNavigate, Outlet, json } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

// import Detail from './routes/Detail';
// import Cart from './routes/Cart';

// 이 컴포넌트가 필요해질 때 import 해줌, 사이트 발행할 때도 별도의 js파일로 분리됨
// 단점은 Detai, Cart 컴포넌트 로딩시간 발생, 이럴 때 <Suspense> 사용
const Detail = lazy(() => import('./routes/Detail'));
const Cart = lazy(() => import('./routes/Cart'));

//context API를 사용하기 위한 문법 3개가 있음
export let Context1 = createContext();

function App() {

  useEffect(() => {
    if (!localStorage.getItem('watched')) {
      localStorage.setItem('watched', JSON.stringify([]));
    }
  }, [])

  // localStorage에는 문자열밖에 저장이 안되서 array/object는 저장이 안됨
  // 그래서 JSON으로 바꾸고 저장하면 됨,
  // 단점은 JSON으로 저장했기 때문에 꺼낼 때 JSON.parse로 다시 객체로 변환
  let obj = { name: 'kim' }
  localStorage.setItem('data', JSON.stringify(obj));
  let 꺼낸거 = localStorage.getItem('data');

  let [shoes, setShoes] = useState(data);
  let [stock] = useState([10, 11, 12]); // context API 연습용 스테이트
  let navigate = useNavigate(); // 페이지 이동을 도와주는 함수

  // axios.get('https://codingapple1.github.io/userdata.json').then((a) => {
  //   console.log(a.data)
  // })

  // react-query 이용해서 ajax 요청, return이 2개
  // 장점1. 성공/실패/로딩중 쉽게 파악 가능
  // 장점2. 틈만나면 자동으로 재요청(refetch) 해줌
  // 장점3. 실패시 retry 알아서 해줌
  // 장점4. state 공유 안해도 됨
  // 장점5. ajax 결과 캐싱기능
  let result = useQuery('작명', () => {
    return axios.get('https://codingapple1.github.io/userdata.json').then((response) => {
      console.log('요청됨')
      return response.data
    })
    // { staleTime : 2000 }
  });

  // result.data
  // result.isLoading
  // result.error

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand onClick={() => { navigate('/'); }}>Shoe Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate('/'); }}>Home</Nav.Link>
            <Nav.Link onClick={() => { navigate('/detail'); }}>Detail</Nav.Link>
            <Nav.Link onClick={() => { navigate('/cart'); }}>Cart</Nav.Link>
          </Nav>
          <Nav className="ms-auto" style={{ color: 'white' }}>
            {/* { result.isLoading ? '로딩중' : result.data.name} */}
            {result.isLoading && '로딩중'}
            {result.error && '에러남'}
            {result.data && result.data.name}
          </Nav>
        </Container>
      </Navbar>

      {/* <Link to="/">홈</Link>
      <Link to="/detail">상세 페이지</Link> */}
      <Suspense fallback={<div>로딩중</div>}>
        <Routes>
          <Route path='/' element={<Main shoes={shoes} setShoes={setShoes} />} />
          {/* :id = url파라미터, 아무거나 입력해도 element속 컴포넌트로 이동 */}
          <Route path='/detail/:id' element={

            // context API를 사용하기 위한 것, value에 보관하고싶은 state 넣음
            <Context1.Provider value={{ stock }}>
              <Detail shoes={shoes} />
            </Context1.Provider>

          } />
          <Route path='/cart' element={<Cart />} />
          {/* nested routes */}
          <Route path='/about' element={<About />}>
            <Route path='member' element={<div>멤버</div>} />
            <Route path='location' element={<div>위치정보</div>} />
          </Route>
          <Route path='/event' element={<Event />}>
            <Route path='one' element={<div>첫 주문시 양배추즙 서비스</div>} />
            <Route path='two' element={<div>생일기념 쿠폰 받기</div>} />
          </Route>
          {/* path='*'은 만들어놓은 이외의 모든 페이지(404) */}
          <Route path='*' element={<div>404</div>} />
        </Routes>
      </Suspense>

    </div>
  );
}

function Item(props) {

  return (
    <div className='col-md-4'>
      <Link to={'/detail/' + (props.i)} style={{ textDecoration: 'none', color: 'black' }}>
        <img src={'https://codingapple1.github.io/shop/shoes' + (props.i + 1) + '.jpg'} width="80%" />
        <h4>{props.shoes.title}</h4>
        <p>{props.shoes.content}</p>
        <p>{props.shoes.price}</p>
      </Link>
    </div>
  )

}

function Main(props) {

  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  return (
    <>
      <div className='main-bg'></div>
      <div className='container'>
        <div className='row'>
          {
            props.shoes.map((data, i) => {
              return (
                <Item shoes={props.shoes[i]} i={i} />
              )
            })
          }
        </div>
        <button onClick={() => {
          axios.get('https://codingapple1.github.io/shop/data2.json')
            .then((result) => {

              let copy = [...props.shoes, ...result.data];
              props.setShoes(copy);
            })
            .catch((err) => {
              console.log('fail')
            });

          // 여러개 동시에 통신
          // Promise.all([ axios.get('/url1'), axios.get('/url2') ])
          // .then((result) => {

          // })

          // fetch('https://codingapple1.github.io/shop/data2.json')
          // .then(result => result.json())
          // .then(data => {

          // })

        }}>더보기</button>
      </div>
    </>
  )
}

function About() {
  return (
    <div>
      <h4>회사 정보임</h4>
      {/* nested routes를 보여줄 위치에 Outlet */}
      <Outlet />
    </div>
  )
}

function Event() {
  return (
    <div>
      <h4>오늘의 이벤트</h4>
      {/* nested routes를 보여줄 위치에 Outlet */}
      <Outlet />
    </div>
  )
}

export default App;
