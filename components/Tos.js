import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeColors } from "../assets/ThemeColors";

const Tos = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            Gym Junkie's Terms of Service{"\n\n"}
          </Text>
          <Text>
            1. Terms{"\n"}By using the GymJjunkie app, you are agreeing to be
            bound by these terms of service, all applicable laws and
            regulations, and agree that you are responsible for compliance with
            any applicable local laws. If you do not agree with any of these
            terms, you are prohibited from using or accessing this application.
            The materials contained in this application are protected by
            applicable copyright and trademark law.{"\n\n"}
          </Text>
          <Text>
            2. Use License{"\n"}Permission is granted to temporarily download
            one copy of the materials (information or software) on GymJunkie's
            application for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under
            this license you may not: modify or copy the materials; use the
            materials for any commercial purpose, or for any public display
            (commercial or non-commercial); attempt to decompile or reverse
            engineer any software contained on GymJunkie's application; remove
            any copyright or other proprietary notations from the materials; or
            transfer the materials to another person or "mirror" the materials
            on any other server. This license shall automatically terminate if
            you violate any of these restrictions and may be terminated by
            GymJunkie at any time. Upon terminating your viewing of these
            materials or upon the termination of this license, you must destroy
            any downloaded materials in your possession whether in electronic or
            printed format.{"\n\n"}
          </Text>
          <Text>
            3. Disclaimer{"\n"}The materials on GymJunkie's application are
            provided on an 'as is' basis. GymJunkie makes no warranties,
            expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or
            conditions of merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights. Further, GymJunkie does not warrant or make any
            representations concerning the accuracy, likely results, or
            reliability of the use of the materials on its application or
            otherwise relating to such materials or on any sites linked to this
            application.{"\n\n"}
          </Text>
          <Text>
            4. Limitations{"\n"}In no event shall GymJunkie or its suppliers be
            liable for any damages (including, without limitation, damages for
            loss of data or profit, or due to business interruption) arising out
            of the use or inability to use the materials on GymJunkie's
            application, even if GymJunkie or a GymJunkie authorized
            representative has been notified orally or in writing of the
            possibility of such damage. Because some jurisdictions do not allow
            limitations on implied warranties, or limitations of liability for
            consequential or incidental damages, these limitations may not apply
            to you.{"\n\n"}
          </Text>
          <Text>
            5. Accuracy of materials{"\n"}The materials appearing on GymJunkie's
            application could include technical, typographical, or photographic
            errors. GymJunkie does not warrant that any of the materials on its
            application are accurate, complete or current. GymJunkie may make
            changes to the materials contained on its application at any time
            without notice. However GymJunkie does not make any commitment to
            update the materials.{"\n\n"}
          </Text>
          <Text>
            6. Links{"\n"}GymJunkie has not reviewed all of the sites linked to
            its application and is not responsible for the contents of any such
            linked site. The inclusion of any link does not imply endorsement by
            GymJunkie of the site. Use of any such linked application is at the
            user's own risk.{"\n\n"}
          </Text>
          <Text>
            7. You shall give us your firstborn child{"\n"}You shall give us
            your firstborn child. You shall give us your firstborn child. You
            shall give us your firstborn child. You shall give us your firstborn
            child. You shall give us your firstborn child. You shall give us
            your firstborn child. You shall give us your firstborn child. You
            shall give us your firstborn child. You shall give us your firstborn
            child. You shall give us your firstborn child. You shall give us
            your firstborn child. You shall give us your firstborn child. You
            shall give us your firstborn child. You shall give us your firstborn
            child. You shall give us your firstborn child. You shall give us
            your firstborn child. You shall give us your firstborn child. You
            shall give us your firstborn child. You shall give us your firstborn
            child. You shall give us your firstborn child. You shall give us
            your firstborn child. You shall give us your firstborn child. You
            shall give us your firstborn child. You shall give us your firstborn
            child.{"\n\n"}
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    padding: 10,
    color: ThemeColors.secondary,
    fontSize: 20,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
    color: ThemeColors.tertiary,
    fontSize: 25,
  },
});

export default Tos;
