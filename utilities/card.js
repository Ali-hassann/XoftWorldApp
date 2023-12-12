import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from './Constants/constant';
import { Ionicons } from '@expo/vector-icons';

const Card = ({ title, onPress, icon, desc }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={28} color={colors.light} />
    <Text style={styles.cardTitle}>{title}</Text>
    {desc.length > 0 && (<Text style={styles.cardDescription}>({desc})</Text>)}

  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: '45%', // Adjust as needed
    height: 150, // Adjust as needed
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
    backgroundColor: colors.primary
  },
  cardTitle: {
    // Add your text styling here
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.light,
    paddingTop: 10,
  },
  cardDescription: {
    // Add your text styling here
    fontSize: 12,
    color: colors.light,
    paddingTop: 3,
  }
});

export default Card;