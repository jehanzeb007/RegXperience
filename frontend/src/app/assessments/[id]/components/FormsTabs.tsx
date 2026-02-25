"use client";

import { useState } from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { AssessmentForm as AssessmentFormType } from "@/types/assessment";
import FormTabPanel from "./FormTabPanel";

interface Props {
  forms: AssessmentFormType[];
}

export default function FormsTabs({ forms }: Props) {
  const [tab, setTab] = useState<number>(0);

  return (
    <Paper>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {forms.map((f, i) => (
          <Tab key={f._id} label={`Form ${i + 1}`} />
        ))}
      </Tabs>

      {forms.map((f, i) => (
        <FormTabPanel key={f._id} value={tab} index={i} form={f} />
      ))}
    </Paper>
  );
}
