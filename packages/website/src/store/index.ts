import { applyMiddleware, combineReducers, createStore } from 'redux';

export interface ApplicationState { }

function createRootReducer() {
	return combineReducers<ApplicationState>({ });
}

function createInitialState(): ApplicationState {
	return { };
}

// export function configureStore() {
// 	const initialState = createInitialState();

// 	const store = createStore(
// 		createRootReducer(),
// 		initialState,
// 		// composeEnhancers(applyMiddleware()),
// 	);

// 	return store;
// }
