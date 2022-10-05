import { configureStore, createSlice } from "@reduxjs/toolkit";
import user from "./store/userSlice";

let stock = createSlice({
    name: 'stock',
    initialState: [10, 11, 12]
});

let item = createSlice({
    name: 'item',
    initialState: [
        {id : 0, name : 'White and Black', count : 2},
        {id : 2, name : 'Grey Yordan', count : 1}
      ],
    reducers: {
        increaseCount(state, action) {
            let idx = state.findIndex((a) => {
                return a.id === action.payload;
            })
            state[idx].count++;
        },
        addItem(state, action) {
            state.push(action.payload);
        }
    }
});

export let { increaseCount, addItem } = item.actions;

// store 생성
// createSlice()로 작성한 state는 reducer에 등록해줘야 component에서 사용 가능
export default configureStore({
    reducer: {
        user: user.reducer,
        stock: stock.reducer,
        item: item.reducer
    }
});