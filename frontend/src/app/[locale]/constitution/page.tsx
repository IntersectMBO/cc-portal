import React from "react";

import { Typography } from "@/components/atoms";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl"; // Import hook for loading translated strings.
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default function Constitution({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const t = useTranslations("Constitution"); // Use the useTranslations hook to load translations for the "Index" namespace.

  return (
    <main>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          boxShadow: "0px 2px 10px 2px rgba(0, 51, 173, 0.15)",
        }}
      >
        <Typography align="center" variant="headline4" sx={{ pb: 3 }}>
          {t("title")}
        </Typography>
        <Box>
          <Typography variant="caption" sx={{ pb: 3 }}>
            Lorem ipsum dolor sit amet consectetur. Tempor imperdiet mi rutrum
            mattis integer proin ac. Scelerisque netus vitae tortor amet neque
            eu. At magna nibh arcu tempor. Nullam auctor sodales et aliquet nisl
            mattis arcu purus ornare. Venenatis lobortis sit adipiscing lacus.
            Bibendum pharetra orci posuere felis nibh.
          </Typography>
          <Typography variant="caption" sx={{ pb: 3 }}>
            Consectetur a velit ipsum aliquet varius viverra. Interdum sed
            viverra molestie commodo amet vestibulum ac. Eget diam nibh
            hendrerit aenean nibh nunc. Sed lacus ullamcorper curabitur ac sed.
            Dui est ultrices cursus congue. Lectus amet pharetra adipiscing quis
            risus maecenas dignissim tincidunt. Neque scelerisque quis faucibus
            at. Eget sollicitudin enim facilisi a lobortis.
          </Typography>
        </Box>
        <Box sx={{ pb: 3 }}>
          <Typography align="center" variant="body1">
            Article 1
          </Typography>
        </Box>
        <Box sx={{ pb: 3 }}>
          <Typography variant="caption">
            Lorem ipsum dolor sit amet consectetur. Suspendisse arcu adipiscing
            lectus urna porta purus. Mus leo sed amet vitae. Et aliquam massa et
            neque et duis. Nunc quis eget mattis bibendum sit. Commodo imperdiet
            dignissim pharetra porttitor lectus in. Scelerisque mi facilisis
            lobortis pretium magnis. Sociis augue tortor ut purus eu id sit.
            Erat ac ultrices nisi viverra egestas cursus purus.
          </Typography>
        </Box>
        <Box sx={{ pb: 3 }}>
          <Typography align="center" variant="body1">
            Article 2
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ pb: 3 }}>
            Lorem ipsum dolor sit amet consectetur. Tempor imperdiet mi rutrum
            mattis integer proin ac. Scelerisque netus vitae tortor amet neque
            eu. At magna nibh arcu tempor. Nullam auctor sodales et aliquet nisl
            mattis arcu purus ornare. Venenatis lobortis sit adipiscing lacus.
            Bibendum pharetra orci posuere felis nibh. Consectetur a velit ipsum
            aliquet varius viverra. Interdum sed viverra molestie commodo amet
            vestibulum ac. Eget diam nibh hendrerit aenean nibh nunc. Sed lacus
            ullamcorper curabitur ac sed. Dui est ultrices cursus congue. Lectus
            amet pharetra adipiscing quis risus maecenas dignissim tincidunt.
            Neque scelerisque quis faucibus at. Eget sollicitudin enim facilisi
            a lobortis. Lorem ipsum dolor sit amet consectetur. Suspendisse arcu
            adipiscing lectus urna porta purus. Mus leo sed amet vitae. Et
            aliquam massa et neque et duis. Nunc quis eget mattis bibendum sit.
            Commodo imperdiet dignissim pharetra porttitor lectus in.
            Scelerisque mi facilisis lobortis pretium magnis. Sociis augue
            tortor ut purus eu id sit. Erat ac ultrices nisi viverra egestas
            cursus purus.
          </Typography>
        </Box>
        <Box sx={{ pb: 3 }}>
          <Typography align="center" variant="body1">
            Article 3
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ pb: 3 }}>
            Lorem ipsum dolor sit amet consectetur. Tempor imperdiet mi rutrum
            mattis integer proin ac. Scelerisque netus vitae tortor amet neque
            eu. At magna nibh arcu tempor. Nullam auctor sodales et aliquet nisl
            mattis arcu purus ornare. Venenatis lobortis sit adipiscing lacus.
            Bibendum pharetra orci posuere felis nibh. Consectetur a velit ipsum
            aliquet varius viverra. Interdum sed viverra molestie commodo amet
            vestibulum ac. Eget diam nibh hendrerit aenean nibh nunc. Sed lacus
            ullamcorper curabitur ac sed. Dui est ultrices cursus congue. Lectus
            amet pharetra adipiscing quis risus maecenas dignissim tincidunt.
            Neque scelerisque quis faucibus at. Eget sollicitudin enim facilisi
            a lobortis. Lorem ipsum dolor sit amet consectetur. Suspendisse arcu
            adipiscing lectus urna porta purus. Mus leo sed amet vitae. Et
            aliquam massa et neque et duis. Nunc quis eget mattis bibendum sit.
            Commodo imperdiet dignissim pharetra porttitor lectus in.
            Scelerisque mi facilisis lobortis pretium magnis. Sociis augue
            tortor ut purus eu id sit. Erat ac ultrices nisi viverra egestas
            cursus purus.
          </Typography>
          <Typography variant="caption" sx={{ pb: 3 }}>
            Eget sollicitudin enim facilisi a lobortis. Lorem ipsum dolor sit
            amet consectetur. Suspendisse arcu adipiscing lectus urna porta
            purus. Mus leo sed amet vitae. Et aliquam massa et neque et duis.
            Nunc quis eget mattis bibendum sit. Commodo imperdiet dignissim
            pharetra porttitor lectus in. Scelerisque mi facilisis lobortis
            pretium magnis. Sociis augue tortor ut purus eu id sit. Erat ac
            ultrices nisi viverra egestas cursus purus.
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
