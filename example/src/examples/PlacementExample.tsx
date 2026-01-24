import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { MenuAnchor, useAnchoredMenuActions } from "react-native-anchored-menu";
import type { Placement, Align } from "react-native-anchored-menu";

interface PlacementDemoProps {
  placement: Placement;
  align: Align;
  label: string;
  description: string;
}

function PlacementDemo({
  placement,
  align,
  label,
  description,
}: PlacementDemoProps) {
  const { open } = useAnchoredMenuActions();
  const menuId = `${placement}-${align}`;

  const openMenu = () => {
    open({
      id: menuId,
      placement,
      align,
      measurement: "stable", // Force stable measurement for better positioning
      measurementTries: 3, // Reduce retries for faster demo
      render: ({ close }) => (
        <View style={styles.demoMenu}>
          <Text style={styles.demoMenuTitle}>{label}</Text>
          <Text style={styles.demoMenuDescription}>{description}</Text>
          <Text style={styles.demoMenuNote}>
            💡 Smart positioning: Falls back when no space
          </Text>
          <Pressable style={styles.demoMenuItem} onPress={close}>
            <Text style={styles.demoMenuText}>✓ Got it</Text>
          </Pressable>
        </View>
      ),
    });
  };

  return (
    <MenuAnchor id={menuId}>
      <Pressable style={styles.demoButton} onPress={openMenu}>
        <Text style={styles.demoButtonText}>{label}</Text>
        <Text style={styles.demoButtonSubtext}>
          {placement} • {align}
        </Text>
      </Pressable>
    </MenuAnchor>
  );
}

export default function PlacementExample() {
  const { open } = useAnchoredMenuActions();
  const [selectedOptions, setSelectedOptions] = useState({
    placement: "auto" as Placement,
    align: "center" as Align,
    offset: 8,
    margin: 16,
  });

  const placements: Placement[] = ["auto", "top", "bottom"];
  const alignments: Align[] = ["start", "center", "end"];

  const openCustomMenu = () => {
    open({
      id: "custom-menu",
      placement: selectedOptions.placement,
      align: selectedOptions.align,
      offset: selectedOptions.offset,
      margin: selectedOptions.margin,
      measurement: "stable", // Force stable measurement
      measurementTries: 3,
      render: ({ close }) => (
        <View style={styles.customMenu}>
          <Text style={styles.customMenuTitle}>Custom Positioned Menu</Text>
          <Text style={styles.customMenuText}>
            Placement: {selectedOptions.placement}
          </Text>
          <Text style={styles.customMenuText}>
            Align: {selectedOptions.align}
          </Text>
          <Text style={styles.customMenuText}>
            Offset: {selectedOptions.offset}px
          </Text>
          <Text style={styles.customMenuText}>
            Margin: {selectedOptions.margin}px
          </Text>
          <Pressable style={styles.customMenuItem} onPress={close}>
            <Text style={styles.customMenuItemText}>Close</Text>
          </Pressable>
        </View>
      ),
    });
  };

  const openResponsiveMenu = (anchorId: string) => {
    console.log("🚀 FIXED VERSION - Opening menu for anchor:", anchorId);
    open({
      id: anchorId,
      placement: "auto",
      align: "center",
      measurement: "stable", // Force stable measurement
      measurementTries: 3,
      render: ({ close, anchor }) => (
        <View style={styles.responsiveMenu}>
          <Text style={styles.responsiveMenuTitle}>
            📍 Responsive Positioning
          </Text>
          <Text style={styles.responsiveMenuText}>
            Anchor Position: {Math.round(anchor.pageX)},{" "}
            {Math.round(anchor.pageY)}
          </Text>
          <Text style={styles.responsiveMenuText}>
            Anchor Size: {Math.round(anchor.width)} ×{" "}
            {Math.round(anchor.height)}
          </Text>
          <Text style={styles.responsiveMenuDescription}>
            The menu automatically positions itself to stay visible on screen
          </Text>
          <Pressable style={styles.responsiveMenuItem} onPress={close}>
            <Text style={styles.responsiveMenuItemText}>Understood</Text>
          </Pressable>
        </View>
      ),
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Placement Options</Text>
        <Text style={styles.sectionDescription}>
          Control where menus appear relative to their anchors. The library uses
          smart positioning - "top" prefers above but falls back to below if no
          space, and vice versa.
        </Text>
      </View>

      <View style={styles.gridSection}>
        <Text style={styles.gridTitle}>Placement × Alignment Grid</Text>

        {placements.map((placement) => (
          <View key={placement} style={styles.placementGroup}>
            <Text style={styles.placementTitle}>
              {placement.toUpperCase()} placement
            </Text>
            <View style={styles.alignmentRow}>
              {alignments.map((align) => (
                <PlacementDemo
                  key={`${placement}-${align}`}
                  placement={placement}
                  align={align}
                  label={`${placement} ${align}`}
                  description={`Menu appears ${placement === "auto" ? "intelligently positioned" : placement} with ${align} alignment`}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Custom Configuration</Text>
        <Text style={styles.sectionDescription}>
          Combine placement, alignment, offset, and margin for precise control.
        </Text>

        <View style={styles.configSection}>
          <View style={styles.configGroup}>
            <Text style={styles.configLabel}>Placement</Text>
            <View style={styles.configRow}>
              {placements.map((placement) => (
                <Pressable
                  key={placement}
                  style={[
                    styles.configOption,
                    selectedOptions.placement === placement &&
                      styles.configOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedOptions((prev) => ({ ...prev, placement }))
                  }
                >
                  <Text
                    style={[
                      styles.configOptionText,
                      selectedOptions.placement === placement &&
                        styles.configOptionTextSelected,
                    ]}
                  >
                    {placement}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.configGroup}>
            <Text style={styles.configLabel}>Alignment</Text>
            <View style={styles.configRow}>
              {alignments.map((align) => (
                <Pressable
                  key={align}
                  style={[
                    styles.configOption,
                    selectedOptions.align === align &&
                      styles.configOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedOptions((prev) => ({ ...prev, align }))
                  }
                >
                  <Text
                    style={[
                      styles.configOptionText,
                      selectedOptions.align === align &&
                        styles.configOptionTextSelected,
                    ]}
                  >
                    {align}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <MenuAnchor id="custom-menu">
            <Pressable style={styles.testButton} onPress={openCustomMenu}>
              <Text style={styles.testButtonText}>Test Custom Settings</Text>
            </Pressable>
          </MenuAnchor>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 Responsive Positioning</Text>
        <Text style={styles.sectionDescription}>
          Menus automatically adjust their position to stay within screen
          bounds.
        </Text>

        <View style={styles.edgeCaseContainer}>
          <View style={styles.edgeCaseRow}>
            <MenuAnchor id="top-left">
              <Pressable
                style={styles.edgeButton}
                onPress={() => openResponsiveMenu("top-left")}
              >
                <Text style={styles.edgeButtonText}>Top Left</Text>
              </Pressable>
            </MenuAnchor>

            <MenuAnchor id="top-right">
              <Pressable
                style={styles.edgeButton}
                onPress={() => openResponsiveMenu("top-right")}
              >
                <Text style={styles.edgeButtonText}>Top Right</Text>
              </Pressable>
            </MenuAnchor>
          </View>

          <View style={styles.edgeCaseCenter}>
            <MenuAnchor id="center">
              <Pressable
                style={styles.centerButton}
                onPress={() => openResponsiveMenu("center")}
              >
                <Text style={styles.centerButtonText}>Center Menu</Text>
              </Pressable>
            </MenuAnchor>
          </View>

          <View style={styles.edgeCaseRow}>
            <MenuAnchor id="bottom-left">
              <Pressable
                style={styles.edgeButton}
                onPress={() => openResponsiveMenu("bottom-left")}
              >
                <Text style={styles.edgeButtonText}>Bottom Left</Text>
              </Pressable>
            </MenuAnchor>

            <MenuAnchor id="bottom-right">
              <Pressable
                style={styles.edgeButton}
                onPress={() => openResponsiveMenu("bottom-right")}
              >
                <Text style={styles.edgeButtonText}>Bottom Right</Text>
              </Pressable>
            </MenuAnchor>
          </View>
        </View>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeSectionTitle}>📖 Placement Behavior</Text>
        <View style={styles.placementExplanation}>
          <Text style={styles.explanationTitle}>
            How Smart Positioning Works:
          </Text>
          <Text style={styles.explanationText}>
            • <Text style={styles.bold}>"auto"</Text> → Chooses best position
            automatically{"\n"}• <Text style={styles.bold}>"top"</Text> →
            Prefers above, falls back to below if no space{"\n"}•{" "}
            <Text style={styles.bold}>"bottom"</Text> → Prefers below, falls
            back to above if no space
          </Text>
          <Text style={styles.explanationNote}>
            💡 This smart fallback prevents menus from appearing off-screen or
            clipped.{"\n"}⚡ Uses "stable" measurement strategy for accurate
            space detection.
          </Text>
        </View>

        <Text style={styles.codeSectionTitle}>💻 Placement API</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{`open({
  id: "my-menu",
  placement: "auto" | "top" | "bottom",
  align: "start" | "center" | "end", 
  offset: 8,             // Distance from anchor
  margin: 16,            // Minimum edge distance
  rtlAware: true,        // Respect RTL layouts
  measurement: "stable", // Accurate space detection
  measurementTries: 3,   // Measurement retries
  render: ({ close, anchor }) => (
    <MenuContent />
  )
})`}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  gridSection: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  placementGroup: {
    marginBottom: 24,
  },
  placementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 12,
    textAlign: "center",
  },
  alignmentRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  demoButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    alignItems: "center",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
  },
  demoButtonSubtext: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 2,
  },
  demoMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 200,
  },
  demoMenuTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  demoMenuDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  demoMenuNote: {
    fontSize: 11,
    color: "#007AFF",
    marginBottom: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
  demoMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    alignItems: "center",
  },
  demoMenuText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "600",
  },
  configSection: {
    marginTop: 16,
    gap: 16,
  },
  configGroup: {
    gap: 8,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
  },
  configRow: {
    flexDirection: "row",
    gap: 8,
  },
  configOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  configOptionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  configOptionText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "600",
  },
  configOptionTextSelected: {
    color: "#fff",
  },
  testButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  testButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  customMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  customMenuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  customMenuText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontFamily: "monospace",
  },
  customMenuItem: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    alignItems: "center",
  },
  customMenuItemText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "600",
  },
  edgeCaseContainer: {
    marginTop: 16,
    height: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 8,
  },
  edgeCaseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  edgeCaseCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  edgeButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  edgeButtonText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "600",
  },
  centerButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  centerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  responsiveMenu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 250,
  },
  responsiveMenuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  responsiveMenuText: {
    fontSize: 12,
    color: "#495057",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  responsiveMenuDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 16,
  },
  responsiveMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
  },
  responsiveMenuItemText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  codeSection: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  placementExplanation: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: "#495057",
    lineHeight: 18,
    marginBottom: 8,
  },
  explanationNote: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
  },
  bold: {
    fontWeight: "bold",
  },
  codeSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: "#2d3748",
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    color: "#e2e8f0",
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 15,
  },
});
