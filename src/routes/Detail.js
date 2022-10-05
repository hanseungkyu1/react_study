import { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { addItem } from "../store.js";

// context API를 가져다 쓰기 위한 문법 2개
import { Context1 } from './../App.js'

let YellowBtn = styled.button`
    background: ${props => props.bg};
    color: ${props => props.bg == 'blue' ? 'white' : 'black'};
    padding: 10px;
`

// let NewBtn = styled.button(YellowBtn)`
//     // 커스텀하면 됨
// `

let Box = styled.div`
    background: grey;
    padding: 20px;
`

function Detail(props) {

    let { context } = useContext(Context1); // 보관함 해체 ex) { state1, state2 }

    let [count, setCount] = useState(0);
    let [alert, setAlert] = useState(true);
    let [text, setText] = useState('');
    let [tab, setTab] = useState(0);
    let { id } = useParams();
    let item = props.shoes.find((x) => {
        return x.id == id;
    });
    let idNum = Number(id);

    let dispatch = useDispatch();

    useEffect(() => {
        let getWatched = localStorage.getItem('watched');
        getWatched = JSON.parse(getWatched);
        getWatched.push(item.id);

        getWatched = new Set(getWatched); // set은 중복 제거
        getWatched = Array.from(getWatched);
        
        localStorage.setItem('watched', JSON.stringify(getWatched));
    }, []);

    // useEffect()는 mount, update시 코드 실행
    // useEffect는 시간이 오래걸리거나 어려울 것 같은, 예를들어
    // 서버에서 데이터 가져오는 작업, 타이머같은 작업은 useEffect안에 작성하면 좋음
    // [] 입력해주면 update시 코드 실행 x, []안에 예를들어 count가 들어가면 count가 update될 때 실행
    useEffect(() => {
        let timer = setTimeout(() => {
            setAlert(false);
        }, 2000);
        // return은 옵션, useEffect동작 전에 실행되는 코드, 별명: clean up function
        // clean up function은 mount시 실행x unmount시 실행
        return () => {
            // 기존 코드 치울 때 여기에 많이 작성
            clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (isNaN(text) == true) {
            alert('숫자만 입력하세요.');
            console.log('숫자만 입력하세요.');
        }
    }, [text]);

    // useEffect(() => { }) 1. 재 렌더링마다 코드실행할 때
    // useEffect(() => { }, []) 2. mount시 코드를 1회만 실행할 때
    // useEffect(() => {
    //     return () => {
    //         3. unmount시 코드를 1회만 실행할 때
    //     }
    // }, [])

    let [fade, setFade] = useState();
    useEffect(() => {
        setFade('end');
        return () => {
            setFade('');
        }
    }, []);

    return (
        <div className={`container start ${fade}`}>
            {
                alert == true
                    ? <div className="alert alert-warning">
                        2초이내 구매시 할인
                    </div>
                    : null
            }
            {/* {count}
            <YellowBtn bg="blue" onClick={() => { setCount(count + 1); }}>버튼</YellowBtn>
            <YellowBtn bg="orange">버튼</YellowBtn> */}
            <div className="row">
                <div className="col-md-6">
                    <img src={'https://codingapple1.github.io/shop/shoes' + (idNum + 1) + '.jpg'} width="100%" />
                </div>
                <div className="col-md-6">
                    <input onChange={(e) => { setText(e.target.value) }}></input>
                    <h4 className="pt-5">{item.title}</h4>
                    <p>{item.content}</p>
                    <p>{item.price}원</p>
                    <YellowBtn bg="grey" onClick={() => {
                        dispatch(addItem({id : item.id, name : item.title, count : 1}));
                    }}>
                        주문하기</YellowBtn>
                </div>
            </div>
            <Nav variant="tabs" defaultActiveKey="link0">
                <Nav.Item>
                    <Nav.Link eventKey="link0" onClick={() => setTab(0)}>버튼0</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link1" onClick={() => setTab(1)}>버튼1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link2" onClick={() => setTab(2)}>버튼2</Nav.Link>
                </Nav.Item>
            </Nav>
            <TabContent tab={tab} />
        </div>
    )
}

function TabContent({ tab }) { // {tab} == props.tab
    // if (tab == 0) {
    //     return <div>내용0</div>;
    // }

    // if (tab == 1) {
    //     return <div>내용1</div>;
    // }

    // if (tab == 2) {
    //     return <div>내용2</div>;
    // }
    let [fade, setFade] = useState();
    useEffect(() => {
        setTimeout(() => { setFade('end'); }, 10);
        return () => {
            setFade('');
        }
    }, [tab]);

    return (<div className={`start ${fade}`}>
        {
            [<div>내용0</div>, <div>내용1</div>, <div>내용2</div>][tab]
        }
    </div>
    )
}

export default Detail;