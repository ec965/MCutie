import React, {useState, useEffect} from 'react';
import {Table, TableHead, TableRow, TableItem} from "../components/table.js";
import {Form, FormItem, FormButton} from "../components/form.js";
import {URL, GETSUB} from "../util.js";
import qs from "querystring";

const TableOfSubs = (props) => {
  const [toggleDel, setToggleDel] = useState(false);
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

  const handleDelete = (event) => {
    const reqOpt = {
      method: "DELETE",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: qs.stringify({topic:event.target.id})
    }
    fetch(URL+GETSUB, reqOpt)
      .then((res)=>{
        if(!res.ok){
          throw new Error(res.status);
        } else return res;
      })
      .then(() => setRefetch(!refetch))
      .catch((err) => console.log(err));
  }

  const rows = subs.map((r, i) => {
    return(
      <TableRow key={i}>
        <TableItem>{r["topic"]}</TableItem>
        <TableItem>{r["qos"]}</TableItem>
        {toggleDel && 
          <TableItem onClick={handleDelete} id={r.topic}>X</TableItem>
        }
      </TableRow>
    );
  });

  return(
    <>
      <SubForm onSubmit={handleSubmit} onChange={handleChange}/>
      <Table>
        <TableRow>
          <TableHead>Subscription</TableHead>
          <TableHead>QoS</TableHead>
          {toggleDel && 
            <TableHead>Delete</TableHead>
          }
        </TableRow>
        {rows}
      </Table>
    </>
  );
}

const SubForm = (props) =>{
  return(
    <Form onSubmit={props.onSubmit}>
      <h3>Subscriber</h3>
      <FormItem type="text" onChange={props.onChange} name="sub">
        Topic
      </FormItem>
      <FormItem type="text" onChange={props.onChange} placeholder={0} name="qos">
        QoS
      </FormItem>
      <FormButton label="Subscribe"/>
    </Form>
  );
}

export default TableOfSubs;