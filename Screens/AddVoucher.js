import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Button, StyleSheet, Alert, TouchableOpacity, Text, Modal, FlatList, StatusBar } from 'react-native';
import AuthService from '../api/auth-service/auth-service';
import CustomHeader from '../utilities/navbar';
import { FontAwesome } from '@expo/vector-icons';
import { colors, defaultValues } from '../utilities/Constants/constant';

const AddVoucher = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState(0);
    const [numberInput, setNumberInput] = useState(0);
    const [postingAccounts, setPostingAccounts] = useState([]);
    const [eventType, setEventType] = useState('');

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedOptionLabel, setSelectedOptionLabel] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {

        if (route.params?.eventType) {
            setEventType(route.params.eventType);
        }

        const userData = AuthService.getUser(); // Replace with the actual function to get user data
        setUser(userData);
        const fetchPostingAccounts = async () => {
            try {
                const token = AuthService.getUser().Token; // Get the JWT token from AuthService

                const response = await fetch(`${defaultValues.baseUrl}/Accounts/GetPostingAccountList?orgId=${AuthService.getUser()?.OrgId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }

                const accounts = await response.json();

                setPostingAccounts(accounts.map(account => ({
                    label: account.PostingAccountName, // Adjust according to your API response
                    value: account.PostingAccountId, // Adjust according to your API response
                })));
            } catch (error) {
                console.error('Error fetching posting accounts:', error);
                Alert.alert("Error", "Failed to fetch posting accounts");
            }
        };
        fetchPostingAccounts();
    }, [route.params]);

    const renderPicker = () => {
        // Filter accounts based on search text
        const filteredAccounts = postingAccounts.filter(account =>
            account.label.toLowerCase().includes(searchText.toLowerCase())
        );

        return (
            <Modal
                visible={isPickerVisible}
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setSearchText}
                        value={searchText}
                        placeholder="Search Accounts"
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredAccounts}
                        keyExtractor={item => item.value.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)}>
                                <Text style={styles.listItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const handleSelect = (item) => {
        setSelectedOption(item.value); // Update the selected value
        setSelectedOptionLabel(item.label); // Update the label for display
        setPickerVisible(false); // Close the picker modal
        setSearchText('');
    };

    const handleSubmit = async () => {
        if (numberInput > 0 && selectedOption > 0) {
            try {
                const token = AuthService.getUser().Token;
                // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
                const response = await fetch(`${defaultValues.baseUrl}/Accounts/AddVoucherTransaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        Id: 0,
                        PostingAccountId: selectedOption,
                        VoucherDate: new Date().toISOString(),
                        Remarks: `Voucher Added by ${AuthService.getUser()?.UserName}`,
                        Amount: numberInput,
                        VoucherType: eventType,
                        BranchId: user.BranchId,
                        OrgId: user.OrgId,
                    }),
                });
                console.log(`acc :${selectedOption} \n ${numberInput}\n ${eventType}\n ${new Date().toISOString()}`);
                if (!response.ok) {
                    throw new Error('API call failed with status ' + response.status);
                }

                const data = await response.json();
                if (data) {
                    Alert.alert("Success", "Voucher added successfully!");
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOption(0);
                    setSelectedOptionLabel('');
                } else {
                    Alert.alert("Success", "something went wrong please try add");
                    console.log(data)
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOptionLabel('');
                }
            } catch (error) {
                console.error('Error during API call:', error);
                Alert.alert("Error", "Failed to add voucher");
            }
        } else {
            Alert.alert("Error", "Please enter Amount and also select person.");
            setSelectedOption(0);
            setNumberInput(0);
            setSelectedOptionLabel(null);
        }
    };
    return (
        <View>
            <View style={styles.container}>
                <CustomHeader title={route.params?.title} showBackButton={true} />

            </View>
            <View style={styles.mainContainer}>
                <ScrollView>

                    <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.pickerTrigger}>
                        <Text style={styles.pickerTriggerText}>{selectedOptionLabel || "Select Account"}</Text>
                        <FontAwesome name="caret-down" size={20} color={colors.dar} />
                    </TouchableOpacity>

                    {renderPicker()}

                    <TextInput
                        style={styles.input}
                        onChangeText={setNumberInput}
                        value={numberInput.toString()}
                        placeholder="Enter a number"
                        keyboardType="numeric"
                        placeholderTextColor="#A0A0A0"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20,
        alignContent: 'center',
        // paddingTop: StatusBar.currentHeight,
        // backgroundColor: colors.neutral, // Light gray background color
        alignItems: 'center', // Center content horizontally
        // paddingVertical: 20, // Add vertical padding
        flexDirection: 'row-reverse'
    },
    pickerTrigger: {
        width: '100%',
        padding: 10,
        marginTopTop: 10,
        backgroundColor: colors.neutral, // Light background color
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Align text and icon horizontally
    },
    pickerTriggerText: {
        flex: 1, // Allow text to grow to the right
        color: colors.dar, // Black text color
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1', // Light gray border color
        borderRadius: 10,
        backgroundColor: colors.light,
        color: colors.dar,
        width: '100%',
        marginBottom: 20,
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:20,
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
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
});

export default AddVoucher;