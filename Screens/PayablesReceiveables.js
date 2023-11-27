import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../api/auth-service/auth-service';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';

const PayablesReceiveables = ({ route }) => {
    const [data, setData] = useState([]); // State to store your data
    const [configList, setConfigList] = useState([]); // State to store your data
    const [subcategoryId, setSubcategory] = useState(0); // State to store your data

    // Set eventType once when route.params changes
    const eventType = route.params?.eventType || 0;

    useEffect(() => {
        getConfigData();
    }, [route.params]);

    useEffect(() => {
        // After setting configList, check the subcategory
        if (configList.length > 0 && eventType) {
            const subcategory = configList.find(e =>
                eventType === 1 ? e.ColumnName === "Creditors" : e.ColumnName === "Debtors"
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

    const getConfigData = async () => {
        try {
            const response = await fetch(`https://xoftworld.com/Accounts/GetConfigurationList?OrgId=${AuthService.getUser().OrgId}&BranchId=${AuthService.getUser().BranchId}`);
            const configData = await response.json();
            setConfigList(configData);
        } catch (error) {
            console.error('Error fetching config data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://xoftworld.com/Accounts/PartyBalances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    BranchId: AuthService.getUser().BranchId,
                    OrgId: AuthService.getUser().OrgId,
                    SubcategoryId: subcategoryId,
                }),
            });

            if (!response.ok) {
                throw new Error('API call failed with status ' + response.status);
            }

            const fetchData = await response.json();
            setData(fetchData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const ListItem = ({ title, description, balance }) => (
        <View style={styles.itemContainer}>
            <View style={styles.iconAndText}>
                {/* <View style={styles.icon} /> */}
                <Ionicons style={{ marginRight: 5 }} name="person-sharp" size={20} color="gray" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text>{description}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>{balance}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.PostingAccountId.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.PostingAccountName}
                        description={item.SubCategoryName}
                        balance={item.ClosingBalance}
                    />
                )}
            />
        </View>
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
    },
    title: {
        fontWeight: 'bold',
    },
    followButton: {
        backgroundColor: '#007AFF', // Follow button color
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PayablesReceiveables;