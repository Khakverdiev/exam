import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    deliveryCountry: 'Azerbaijan',
    specificCountry: '',
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    phoneNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    selectedCity: '', // Новое состояние для выбранного города
    error: null,
    successMessage: '',
    orderDetails: null,
    deliveryTime: '',
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setDeliveryCountry(state, action) {
            state.deliveryCountry = action.payload;
        },
        setSpecificCountry(state, action) {
            state.specificCountry = action.payload;
        },
        setFirstName(state, action) {
            state.firstName = action.payload;
        },
        setLastName(state, action) {
            state.lastName = action.payload;
        },
        setAddress(state, action) {
            state.address = action.payload;
        },
        setZipCode(state, action) {
            state.zipCode = action.payload;
        },
        setPhoneNumber(state, action) {
            state.phoneNumber = action.payload;
        },
        setCardNumber(state, action) {
            state.cardNumber = action.payload;
        },
        setCardExpiry(state, action) {
            state.cardExpiry = action.payload;
        },
        setCardCVV(state, action) {
            state.cardCVV = action.payload;
        },
        setSelectedCity(state, action) { // Новое действие для выбранного города
            state.selectedCity = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setSuccessMessage(state, action) {
            state.successMessage = action.payload;
        },
        setOrderDetails(state, action) {
            state.orderDetails = action.payload;
        },
        setDeliveryTime(state, action) {
            state.deliveryTime = action.payload;
        },
        resetOrder(state) {
            return initialState;
        },
    },
});

export const {
    setDeliveryCountry,
    setSpecificCountry,
    setFirstName,
    setLastName,
    setAddress,
    setZipCode,
    setPhoneNumber,
    setCardNumber,
    setCardExpiry,
    setCardCVV,
    setSelectedCity,
    setError,
    setSuccessMessage,
    setOrderDetails,
    setDeliveryTime,
    resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;