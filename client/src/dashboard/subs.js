import React, {useState, useEffect} from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {Form, FormItem, FormButton} from "../components/form.js";
import {URL, GETSUB} from "../util.js";
import qs from "querystring";

const TableOfSubs = (props) => {
  const [subs, setSubs] = useState([]);
  const [newSub, setNewSub] = useState("");
  const [newQos, setNewQos] = useState(0);
  const [refetch, setRefetch] = useState(false);

  useEffect(()=> {
    fetch(URL+GETSUB)
      .then((res) => res.json())
      .then((data) => {
        setSubs(data);
      });
    
  }, [refetch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reqOpt = {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: qs.stringify({topic: newSub, qos: newQos}),
    }
    fetch(URL+GETSUB, reqOpt)
      .then((res) => {
        if (! res.ok){
          throw new Error(res.status)
        } else return res;
      })
      .then(()=> setRefetch(!refetch)) // reload the subscriptions
      .catch((err) => console.log(err));
  }

  const handleChange = (event) => {
    if (event.target.name === "sub"){
      setNewSub(event.target.value);
    }
    if (event.target.name === "qos"){
      setNewQos(event.target.value);
    }
  }

  const rows = subs.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>{r["topic"]}</TableItem>
        <TableItem>{r["qos"]}</TableItem>
      </TableRow>
    );
  });

  return(
    <div>
      <SubForm onSubmit={handleSubmit} onChange={handleChange}/>
      <Table>
        <TableRow>
          <TableHead>Subscription</TableHead>
          <TableHead>QoS</TableHead>
        </TableRow>
        {rows}
      </Table>
    </div>
  );
}

const SubForm = (props) =>{
  return(
    <Form onSubmit={props.onSubmit}>
      <FormItem onChange={props.onChange} name="sub">
        <p>Add Subscription</p>
      </FormItem>
      <FormItem onChange={props.onChange} placeholder={0} name="qos">
        <p>QoS</p>
      </FormItem>
      <FormButton label="Submit"/>
    </Form>
  );
}

export default TableOfSubs;