const formatEuro = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString() + " €";
};

export default formatEuro