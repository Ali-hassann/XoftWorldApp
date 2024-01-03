import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../api/auth-service/auth-service';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, TextInput, Button } from 'react-native';
import CustomHeader from '../utilities/navbar';
import { defaultValues } from '../utilities/Constants/constant';
import Loader from '../utilities/loader';

const PayablesReceiveables = ({ route }) => {
    const [data, setData] = useState([]); // State to store your data
    const [configList, setConfigList] = useState([]); // State to store your data
    const [subcategoryId, setSubcategory] = useState(0); // State to store your data
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Set eventType once when route.params changes
    const eventType = route.params?.eventType || 0;

    useEffect(() => {
        getConfigData();
    }, [route.params]);

    useEffect(() => {
        // After setting configList, check the subcategory
        if (configList.length > 0 && eventType) {
            const subcategory = configList.find(e =>
                eventType === 1 ? e.ColumnName === "Creditors" : eventType === 2 ? e.ColumnName === "Debtors" : eventType === 3 ? e.ColumnName === "Expense" : e.ColumnName === "Banks"
            )?.PostingAccountId ?? 0;

            setSubcategory(subcategory);
        }
    }, [configList, eventType]);

    useEffect(() => {
        // Fetch data once subcategoryId is set
        if (subcategoryId) {
            fetchData();
        }
    }, [subcategoryId]);

    const loader = (value) => {
        setIsLoading(value);
    };

    const renderHeader = () => {
        return (
            <>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    placeholder="Search ..."
                    autoFocus={true}
                />
                {/* <FontAwesome name="search" size={24} color="black" /> */}
            </>
        );
    };

    const getConfigData = async () => {
        try {
            loader(true);
            const token = AuthService.getUser().Token; // Get the JWT token from AuthService

            const response = await fetch(`${defaultValues.baseUrl}/Accounts/GetConfigurationList?OrgId=${AuthService.getUser().OrgId}&BranchId=${AuthService.getUser().BranchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the Bearer token to the Authorization header
                },
            });

            if (!response.ok) {
                loader(false);
                throw new Error('API call failed with status ' + response.status);
            }

            const configData = await response.json();
            setConfigList(configData);
            loader(false);
        } catch (error) {
            loader(false);
            console.error('Error fetching config data:', error);
        }
    };

    const fetchData = async () => {
        try {
            loader(true);
            const token = AuthService.getUser().Token; // Get the JWT token from AuthService
            const response = await fetch(`${defaultValues.baseUrl}/Accounts/PartyBalances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    BranchId: AuthService.getUser().BranchId,
                    OrgId: AuthService.getUser().OrgId,
                    SubcategoryId: subcategoryId,
                }),
            });

            if (!response.ok) {
                loader(false);
                throw new Error('API call failed with status ' + response.status);
            }

            const fetchData = await response.json();
            setData(fetchData);
            loader(false);
        } catch (error) {
            loader(false);
            console.error('Error fetching data:', error);
        }

        setTimeout(() => {
            // When the API call is complete, hide the loader
            loader(false);
        }, 5000); // Simulated 2-second delay
    };

    const ListItem = ({ item }) => {
        console.log(item.PostingAccountName);
        if (!item.PostingAccountName?.toLowerCase().includes(searchQuery?.toLowerCase()) && searchQuery?.length > 0) {
            return null; // Don't render the item if it doesn't match the search
        }

        return (
            <View style={styles.itemContainer}>
                <View style={styles.iconAndText}>
                    {/* <View style={styles.icon} /> */}
                    {/* <Ionicons style={{ marginRight: 5 }} name="person-sharp" size={20} color="gray" /> */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.PostingAccountName}</Text>
                    </View>
                </View>
                {item.LocationName?.length > 0 && (
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.LocationName}</Text>
                    </View>
                )}
                <Text style={styles.followButtonText}>{item.ClosingBalance}</Text>
            </View>
        );
    };

    const renderCustomerPicker = () => {
        // Filter accounts based on search text
        const filteredCustomer = data.filter(item => item.PostingAccountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.LocationName.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
            <Modal
                visible={true}
                animationType="slide"
            >
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        placeholder="Search ..."
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredCustomer}
                        keyExtractor={item => item?.PostingAccountId?.toString()}
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

    return (
        <>
            <View style={styles.container}>
                <CustomHeader title={route.params?.title} showBackButton={true} />
                <Loader visible={isLoading} />
                {(data.length === 0 && isLoading === false) && (<View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Text >No Data Found</Text>
                </View>)}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                {data.length > 0 && (
                    <>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.PostingAccountId.toString()}
                            renderItem={ListItem}
                            keyboardShouldPersistTaps="always" // This prop prevents keyboard from closing
                        />
                    </>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20, // Space at the top to prevent overlap with the header
        marginTop: StatusBar.currentHeight
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderBlockColor: 'lightgray'
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#aaa', // This should be the color of your icon
        marginRight: 10,
    },
    textContainer: {
        justifyContent: 'center',
        maxWidth: 110,
        minWidth: 100,
    },
    title: {
        fontWeight: '300',
    },

    followButtonText: {

        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        margin: 10,
        borderRadius: 5,
    },
});

export default PayablesReceiveables;