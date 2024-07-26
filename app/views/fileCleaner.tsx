import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { ipcRenderer } from "electron";
import Api from "../helpers/api";
import '../styles/components/fileCleaner.css';

const defaultSubstitutions = [
  { find: "720p", replace: "" },
  { find: "1080p", replace: "" },
  { find: "4K", replace: "" },
  { find: "(Spanish English)", replace: "" },
  { find: "web-dl", replace: "" },
  { find: "x264", replace: "" },
  { find: "x265", replace: "" },
  { find: "h264", replace: "" },
  { find: "h265", replace: "" },
  { find: "10bit", replace: "" },
  { find: "8bit", replace: "" },
  { find: "6ch", replace: "" },
];

const FileCleaner = () => {
  const [originFolder, setOriginFolder] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [substitutions, setSubstitutions] = useState(defaultSubstitutions);

  const changeOriginFolder = async () => {
    const path = await ipcRenderer.invoke(
      "open-directory-dialog",
      originFolder
    );
    setOriginFolder(path);
  };

  const loadFileNames = async () => {
    if (originFolder) {
      const files = await Api.getFilesInFolder(originFolder);
      setFileNames(files);
    }
  };

  useEffect(() => {
    loadFileNames();
  }, [originFolder]);

  const handleAddSubstitution = () => {
    setSubstitutions([{ find: "", replace: "" }, ...substitutions]);
  };

  const handleSubstitutionChange = (index, field, value) => {
    const newSubstitutions = [...substitutions];
    newSubstitutions[index][field] = value;
    setSubstitutions(newSubstitutions);
  };

  const cleanFileNames = () => {
    const cleanedFileNames = fileNames.map((fileName) => {
      let newFileName = fileName;
      substitutions.forEach(({ find, replace }) => {
        const regex = new RegExp(find, "g");
        newFileName = newFileName.replace(regex, replace);
      });
      return newFileName;
    });
    setFileNames(cleanedFileNames);
  };

  return (
    <Container className="container-scroll">
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>File Name Cleaner</Breadcrumb.Item>
      </Breadcrumb>
      <h2>File Name Cleaner</h2>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formOriginFolder">
              <Form.Label>
                <Icon.Folder2Open className="me-2" size={20} color="blue" />
                Origin Folder
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Origin Folder"
                value={originFolder}
                readOnly
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={changeOriginFolder}
              >
                ...
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6}>
          <Form.Label>
          <Icon.Scissors className="me-2" size={20} color="blue" />
            Substitution Rules</Form.Label>
          <div className="table-container">
            <Table striped bordered hover>
              <thead className="table-header">
                <tr>
                  <th>Find</th>
                  <th>Replace</th>
                </tr>
              </thead>
              <tbody>
                {substitutions.map((substitution, index) => (
                  <tr key={index}>
                    <td className="cell-no-padding">
                      <Form.Control
                        type="text"
                        value={substitution.find}
                        onChange={(e) =>
                          handleSubstitutionChange(
                            index,
                            "find",
                            e.target.value
                          )
                        }
                        className="form-control-flat"
                        />
                    </td>
                    <td className="cell-no-padding">
                      <Form.Control
                        type="text"
                        value={substitution.replace}
                        onChange={(e) =>
                          handleSubstitutionChange(
                            index,
                            "replace",
                            e.target.value
                          )
                        }
                        className="form-control-flat"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Button variant="outline-primary" onClick={handleAddSubstitution}>
            Add Substitution
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Button
            variant="primary"
            type="button"
            size="lg"
            className="mx-auto d-block mt-3"
            onClick={cleanFileNames}
            disabled={!originFolder}
          >
            <Icon.FileEarmarkText className="me-2" size={20} color="white" />
            Clean File Names
          </Button>
        </Col>
      </Row>      
      <Row>
        <Col md={12}>
          <h4>File Names</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>File Name</th>
              </tr>
            </thead>
            <tbody>
              {fileNames.map((fileName, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{fileName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>


    </Container>
  );
};

export default FileCleaner;