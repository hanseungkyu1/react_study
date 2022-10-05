import { createSlice } from "@reduxjs/toolkit";


// useState랑 비슷한 역할, 이곳에 state 만듬
let user = createSlice({
    name: 'user',
    initialState: { name: 'kim', age: 20 },
    // redux를 사용할 때 state변경 하려면 state 수정해주는 함수 만듬
    reducers: {
        changeName(state) { // state는 기존 state
            // return 'john kim' // == 'john ' + state
            state.name = 'park';
        },
        increase(state, action) {
            state.age += action.payload;
        }
    }
});

// export할 함수명들은 {}에 적어주면 됨, state변경 함수들을 action이라고 함
export let { changeName, increase } = user.actions;
export default user;