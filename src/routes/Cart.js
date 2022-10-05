import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeName, increase } from "./../store/userSlice.js"
import { increaseCount } from "./../store.js"
import { memo, useMemo, useState } from "react";

// 자식 컴포넌트 재렌더링 막기
// memo = 꼭 필요할 때만 재렌더링 해줌
// Child의 props가 변할 때만 재렌더링 해줌
let Child = memo(function() {
    console.log('재렌더링됨');
    return <div>자식임</div>
});

function 함수() {
    return '반복문 10억번 돌린결과';
}

function Cart() {
    // useMemo = 컴포넌트 렌더링시 1회만 실행해줌
    let result = useMemo(() => { return 함수() }, [/* state */]);

    let state = useSelector((state) => {
        return state
    });

    // store.js로 요청 보내주는 함수
    let dispatch = useDispatch();
    let [count, setCount] = useState(0);

    return (
        <div>
            <Child count={count}></Child>
            <button onClick={() => { setCount(count+1)} }>+</button>

            <h6>{state.user.name} {state.user.age}의 장바구니</h6>
            <button onClick={() => { dispatch(increase(1)) }}>버튼</button>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>변경하기</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        state.item.map((data, i) => {
                            return (
                                < tr >
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.count}</td>
                                    <td>
                                        <button onClick={() => { dispatch(increaseCount(state.item[i].id)) }}>+</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default Cart;