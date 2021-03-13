import React from "react";
import { Button } from "@material-ui/core";

export default function PDF(props) {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  return (
    <section>
      <section ref={bodyRef}>{props.children}</section>
      <Button
        color="secondary"
        variant="contained"
        onClick={createPdf}
        style={{ marginTop: "1%", marginLeft: '2%' }}
      >
        Download PDF
      </Button>
    </section>
  );
}
