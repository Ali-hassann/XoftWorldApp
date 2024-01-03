import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity, Text, Modal, FlatList, StatusBar } from 'react-native';
import AuthService from '../api/auth-service/auth-service';
import CustomHeader from '../utilities/navbar';
import { FontAwesome } from '@expo/vector-icons';
import { colors, defaultValues } from '../utilities/Constants/constant';
import Loader from '../utilities/loader';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
// import DatePicker from '@react-native-community/datetimepicker';

const AddOrder = ({ route }) => {
    const [eventType, setEventType] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [packQuantity, setPackQuantity] = useState(0);
    const [loseQuantity, setLoseQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [customersList, setCustomer] = useState([]);
    const [productList, setProduct] = useState([]);
    const [filterProductList, setFilterProduct] = useState([]);
    const [saleOrderProductList, setSaleOrderProductList] = useState([]);

    const [isCustomerPickerVisible, setCustomerPickerVisible] = useState(false);
    const [isBrandPickerVisible, setBrandPickerVisible] = useState(false);
    const [isProductPickerVisible, setProductPickerVisible] = useState(false);
    const [customerSearchText, setCustomerSearchText] = useState('');
    const [brandSearchText, setBrandSearchText] = useState('');
    const [productSearchText, setProductSearchText] = useState('');
    const [user, setUser] = useState(null);
    const [loseQuantityError, setLoseQuantityError] = useState('');
    const [packQuantityError, setPackQuantityError] = useState('');
    const [selectedCustomerError, setSelectedCustomerError] = useState('');
    const [selectedProductError, setSelectedProductError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (route.params?.eventType) {
            setEventType(route.params.eventType);
        }

        const userData = AuthService.getUser();
        setUser(userData);
        const token = AuthService.getUser().Token;
        const fetchCustomers = async () => {
            try {

                const response = await fetch(`${defaultValues.baseUrl}/Stock/GetParticularList`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        BranchId: userData.BranchId,
                        OrgId: userData.OrgId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }

                const customers = await response.json();

                setCustomer(customers);
            } catch (error) {
                console.error('Error fetching customers:', error);
                Alert.alert("Error", "Failed to fetch customers");
            }
        };
        fetchCustomers();

        const fetchProducts = async () => {
            try {

                // const token = AuthService.getUser().Token;
                const response = await fetch(`${defaultValues.baseUrl}/Stock/GetProductList`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        BranchId: userData.BranchId,
                        OrgId: userData.OrgId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }

                const products = await response.json();

                setProduct(products);
                setFilterProduct(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                Alert.alert("Error", "Failed to fetch products");
            }
        };
        fetchProducts();
    }, [route.params]);

    const loader = (value) => {
        setIsLoading(value);
    };

    const renderBrandPicker = () => {
        const uniqueBrandNames = [...new Set(productList.map(product => product.CompanyBrandName))];

        // Filter accounts based on search text
        const filteredBrand = uniqueBrandNames.filter(brand =>
            brand?.toLowerCase().includes(brandSearchText.toLowerCase())
        );

        return (
            <Modal
                visible={isBrandPickerVisible}
                animationType="slide"
                onRequestClose={() => setBrandPickerVisible(false)}
            >
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setBrandSearchText}
                        value={brandSearchText}
                        placeholder="Search Brand"
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredBrand}
                        keyExtractor={item => item?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleBrandSelect(item)}>
                                <Text style={styles.listItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const renderCustomerPicker = () => {
        // Filter accounts based on search text
        const filteredCustomer = customersList.filter(customer =>
            customer?.PostingAccountName?.toLowerCase().includes(customerSearchText.toLowerCase())
        );

        return (
            <Modal
                visible={isCustomerPickerVisible}
                animationType="slide"
                onRequestClose={() => setCustomerPickerVisible(false)}
            >
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setCustomerSearchText}
                        value={customerSearchText}
                        placeholder="Search Customer"
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredCustomer}
                        keyExtractor={item => item?.ParticularId?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)}>
                                <Text style={styles.listItemText}>{item.PostingAccountName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const renderProductsPicker = () => {
        // Filter accounts based on search text
        const filteredProduct = filterProductList?.filter(product =>
            product?.ProductName?.toLowerCase().includes(productSearchText.toLowerCase())
        );

        return (
            <Modal
                visible={isProductPickerVisible}
                animationType="slide"
                onRequestClose={() => isProductPickerVisible(false)}
            >
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setProductSearchText}
                        value={productSearchText}
                        placeholder="Search Product"
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredProduct}
                        keyExtractor={item => item?.ProductId?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleProductSelect(item)}>
                                <Text style={styles.listItemText}>{item.ProductName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const handleBrandSelect = (brandName) => {
        const filterProducts = productList.filter(r => r.CompanyBrandName === brandName);
        setFilterProduct(filterProducts);
        setSelectedBrand(brandName); // Update the selected value
        setBrandPickerVisible(false); // Close the picker modal
        setBrandSearchText('');
    };

    const handleSelect = (item) => {
        setSelectedCustomer(item); // Update the selected value
        setCustomerPickerVisible(false); // Close the picker modal
        setCustomerSearchText('');
    };


    const handleProductSelect = (item) => {
        setSelectedProduct(item); // Update the selected value
        setProductPickerVisible(false); // Close the picker modal
        setProductSearchText('');
        setPrice(item?.SalePrice);
    };

    const validateSubmit = () => {
        let isValid = true;

        if (saleOrderProductList.length == 0) {
            Alert.alert('Add Products', 'Please select products.');
            isValid = false;
        }

        if (selectedCustomer?.ParticularId == 0) {
            setSelectedCustomerError('Select customer');
            isValid = false;
        } else {
            setSelectedCustomerError('');
        }

        return isValid;
    };

    const validateAddProduct = () => {
        let isValid = true;

        if (packQuantity === 0 && loseQuantity === 0) {
            setPackQuantityError('Amount must be greater then 0.');
            setLoseQuantityError('Amount must be greater then 0.');
            isValid = false;
        } else {
            setPackQuantityError('');
            setLoseQuantityError('');
        }

        if (!selectedProduct) {
            setSelectedProductError('Select product');
            isValid = false;
        } else {
            setSelectedProductError('');
        }

        if (!selectedCustomer) {
            setSelectedCustomerError('Select customer');
            isValid = false;
        } else {
            setSelectedCustomerError('');
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (validateSubmit()) {
            try {
                loader(true);
                const token = AuthService.getUser().Token;
                const response = await fetch(`${defaultValues.baseUrl}/Stock/AddSaleOrderList`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(saleOrderProductList),
                });
                // console.log(`acc :${selectedOption} \n ${numberInput}\n ${eventType}\n ${new Date().toISOString()}`);
                if (!response.ok) {
                    loader(false);
                    throw new Error('API call failed with status ' + response.status);
                }

                const data = await response.json();
                if (data) {
                    loader(false);
                    Alert.alert("Success", "Order added successfully!");
                    setSelectedCustomer(null);
                    setSaleOrderProductList([]);
                    setRemarks('');
                    broadcastMessage(`Sale order is generated`, token);
                } else {
                    Alert.alert("Success", "something went wrong please try again");
                }
            } catch (error) {
                loader(false);
                console.error('Error during API call:', error);
                Alert.alert("Error", "Failed to add order");
            }
        } else {
            loader(false);
        }
    };
    // public decimal Amount { get => TotalLoseQuantity * Price; set => _ = value; }
    // public int TotalLoseQuantity { get => (PackQuantity * QuantityPerPack) + LoseQuantity; set => _ = value; }
    const handleAddProduct = () => {
        if (validateAddProduct()) {
            let finalPrice = price > 0 ? price : parseInt(selectedProduct?.SalePrice);
            let totalLoseQuantity = (packQuantity * selectedProduct?.QuantityPerPack) + loseQuantity;
            let product = {
                ProductId: selectedProduct.ProductId,
                ProductName: selectedProduct.ProductName,
                QuantityPerPack: selectedProduct.QuantityPerPack,
                PackQuantity: packQuantity,
                LoseQuantity: loseQuantity,
                ParticularId: selectedCustomer?.ParticularId,
                Remarks: remarks,
                OrgId: AuthService.getUser().OrgId,
                BranchId: AuthService.getUser().BranchId,
                OrderDate: new Date(),
                Price: finalPrice,
                Amount: (totalLoseQuantity * finalPrice),
            };

            setSaleOrderProductList([...saleOrderProductList, product]);
            setPackQuantity(0);
            setLoseQuantity(0);
            setPrice(0);
            setSelectedProduct(null);
            console.log(product);
            console.log(totalLoseQuantity);
            console.log(finalPrice);
        }
    };

    const broadcastMessage = async (message, token) => {
        // console.log(message);
        await fetch(`${defaultValues.baseUrl}/Accounts/BroadCastMessage?message=${message}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    const showDatePicker = () => {
        DatePicker.open({
            date: orderDate,
            mode: 'date', // Set the mode to 'date' for selecting only date
            onDateChange: (newDate) => {
                setOrderDate(newDate);
            },
        });
    };

    return (
        <View >
            <View style={styles.container}>
                <CustomHeader title={route.params?.title} showBackButton={true} />
            </View>
            <View style={styles.mainContainer}>
                <ScrollView>
                    <TouchableOpacity onPress={() => setCustomerPickerVisible(true)} style={styles.pickerTrigger}>
                        <Text style={styles.pickerTriggerText}>{selectedCustomer?.PostingAccountName || "Select customer"}</Text>
                        <FontAwesome name="caret-down" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    {selectedCustomerError ? <Text style={styles.errorText}>{selectedCustomerError}</Text> : null}
                    {renderCustomerPicker()}
                    <TextInput
                        style={styles.input}
                        onChangeText={setRemarks}
                        value={remarks}
                        placeholder="Enter remarks"
                        keyboardType="default"
                        placeholderTextColor="#A0A0A0"
                    />
                    <TouchableOpacity onPress={() => setBrandPickerVisible(true)} style={styles.pickerTrigger}>
                        <Text style={styles.pickerTriggerText}>{selectedBrand || "Select brand"}</Text>
                        <FontAwesome name="caret-down" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    {renderBrandPicker()}

                    <View style={styles.selectItemRow}>
                        <View style={[styles.col6, { flex: 8 }]}>
                            <TouchableOpacity onPress={() => setProductPickerVisible(true)} style={styles.pickerTrigger}>
                                <Text style={styles.pickerTriggerText}>{selectedProduct?.ProductName || "Select product"}</Text>
                                <FontAwesome name="caret-down" size={20} color={colors.primary} />
                            </TouchableOpacity>
                            {selectedProductError ? <Text style={styles.errorText}>{selectedProductError}</Text> : null}
                            {renderProductsPicker()}
                        </View>
                        <View style={[styles.col6, { flex: 2 }]}>
                            <View style={styles.addButtonContainer}>
                                <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
                                    {/* <Text style={styles.buttonText}>Add Product</Text> */}
                                    <Octicons name="diff-added" size={24} color={colors.light} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={styles.selectItemRow}>
                        <View style={styles.col4}>
                            <Text>Pack Quantity</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPackQuantity}
                                value={packQuantity.toString()}
                                placeholder="Enter pack quantity"
                                keyboardType="numeric"
                                placeholderTextColor="#A0A0A0"
                            />
                            {packQuantityError ? <Text style={styles.errorText}>{packQuantityError}</Text> : null}
                        </View>
                        <View style={styles.col4}>
                            <Text>Lose Quantity</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setLoseQuantity}
                                value={loseQuantity.toString()}
                                placeholder="Enter lose quantity"
                                keyboardType="numeric"
                                placeholderTextColor="#A0A0A0"
                            />
                            {loseQuantityError ? <Text style={styles.errorText}>{loseQuantityError}</Text> : null}
                        </View>
                        <View style={styles.col4}>
                            <Text>Price</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPrice}
                                value={price.toString()}
                                placeholder="Enter price"
                                keyboardType="numeric"
                                placeholderTextColor="#A0A0A0"
                            />
                            {/* {loseQuantityError ? <Text style={styles.errorText}>{loseQuantityError}</Text> : null} */}
                        </View>

                    </View>

                    <View>
                        <ScrollView style={{ maxHeight: 300 }}>
                            <FlatList
                                data={saleOrderProductList}
                                keyExtractor={(item) => `${item?.ProductId}${item?.PackQuantity}`}
                                renderItem={({ item, index }) => (
                                    index === 0 ?
                                        <>
                                            <View style={styles.row}>
                                                <View style={[styles.column, { flex: 3 }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>Product</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>Pack</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>Lose</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>Amt</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 1 }]}>
                                                    <Text style={{ fontWeight: 'bold' }}>Action</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={[styles.column, { flex: 3 }]}>
                                                    <Text>{item.ProductName}</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text>{item.PackQuantity}</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text>{item.LoseQuantity}</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 2 }]}>
                                                    <Text>{item.Amount}</Text>
                                                </View>
                                                <View style={[styles.column, { flex: 1 }]}>
                                                    <Entypo name="trash" size={20} color={colors.danger} />
                                                </View>
                                            </View>
                                        </> :
                                        <View style={styles.row}>
                                            <View style={[styles.column, { flex: 3 }]}>
                                                <Text>{item.ProductName}</Text>
                                            </View>
                                            <View style={[styles.column, { flex: 2 }]}>
                                                <Text>{item.PackQuantity}</Text>
                                            </View>
                                            <View style={[styles.column, { flex: 2 }]}>
                                                <Text>{item.LoseQuantity}</Text>
                                            </View>
                                            <View style={[styles.column, { flex: 2 }]}>
                                                <Text>{parseInt(item.Amount)}</Text>
                                            </View>
                                            <View style={[styles.column, { flex: 1 }]}>
                                                <Entypo name="trash" size={20} color={colors.danger} />
                                            </View>
                                        </View>
                                )}
                            />
                        </ScrollView>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <Loader visible={isLoading} />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        // backgroundColor: colors.neutral, // Light gray background color
        // alignItems: 'center', // Center content horizontally
        // paddingVertical: 20, // Add vertical padding
    },
    mainContainer: {
        // flex:1,
        width: '100%',
        // paddingTop: 50,
        paddingHorizontal: 20,
        alignContent: 'center',
        // paddingTop: StatusBar.currentHeight,
        // backgroundColor: colors.neutral, // Light gray background color
        alignItems: 'center', // Center content horizontally
        // paddingVertical: 20, // Add vertical padding
        flexDirection: 'row'
    },
    pickerTrigger: {
        width: '100%',
        padding: 14,
        marginTopTop: 10,
        backgroundColor: colors.light, // Light background color
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Align text and icon horizontally
        borderWidth: 1,
        borderColor: '#D1D1D1',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerTriggerText: {
        flex: 1, // Allow text to grow to the right
        color: colors.dar, // Black text color
    },
    errorText: {
        color: colors.danger,
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1', // Light gray border color
        borderRadius: 10,
        backgroundColor: colors.light,
        color: colors.dar,
        // width: '20%',
        // marginBottom: 20,
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    addButtonContainer: {
        // marginTop: 20,
        width: '100%',
        borderRadius: 20,
        // overflow: 'hidden',
    },
    addButton: {
        backgroundColor: colors.secondary,
        padding: 5,
        marginHorizontal: 10,
        marginTop: 8,
        alignItems: 'center',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        alignItems: 'center',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: colors.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: 20,
        margin: 20,
        backgroundColor: colors.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItemText: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D1',
        fontSize: 15,
        color: colors.dar,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        marginBottom: 20,
        width: '100%',
        color: colors.dar,
    },
    selectItemRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
    },
    col6: {
        width: '49%',
        marginHorizontal: 2
    },
    col4: {
        width: '32%',
        marginHorizontal: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        width: '100%',
    },
    column: {
        // flex: 1,
    },
});

export default AddOrder;