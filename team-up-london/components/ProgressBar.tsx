import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';

interface ProgressBarProps {
    label: string;
    current: number;
    target: number;
    color?: string;
    showNumbers?: boolean;
    isChallenge?: boolean;
}

export default function ProgressBar({
    label,
    current,
    target,
    color = Colours.primary,
    isChallenge = false,
}: ProgressBarProps) {
    const percentage = Math.min((current / target) * 100, 100);
    const isComplete = current >= target;

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
            </View>

            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { backgroundColor: color },
                        { width: `${percentage}%` }
                    ]}
                />
                <View style={styles.progressBarBackground} />
            </View>

            {isComplete && (
                <Text style={[styles.completeLabel, { color }]}>Complete!</Text>
            )}

            
            <Text style={styles.subText}>
                {target - current} more games{isChallenge ? ' to earn a badge' : ''}!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontFamily: Fonts.main,
        fontWeight: '600',
        color: Colours.textPrimary,
    },
    subText: {
        marginTop: 4,
        alignSelf: "center",
        fontSize: 16,
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
    },
    completeText: {
        color: Colours.success,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
    },
    progressBarBackground: {
        height: '100%',
        width: '100%',
        backgroundColor: '#e0e0e0',
    },
    completeLabel: {
        fontSize: 12,
        fontFamily: Fonts.main,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 4,
    },
});