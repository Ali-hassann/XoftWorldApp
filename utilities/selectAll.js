export const selectAll = (inputRef) => {
    console.log(inputRef.value);
    if (inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.setSelectionRange(0, inputRef.value.length);
    }
};
