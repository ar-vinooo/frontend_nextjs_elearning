import { Select, Box, Tabs, TabList, Tab, TabPanels, TabPanel, Textarea, Input, useDisclosure, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Stack, Text, FormControl } from '@chakra-ui/react'
import axios from 'axios'
import { MultiSelect, useMultiSelect, useSelect } from 'chakra-multiselect'
import { useEffect, useState } from 'react'
import { useKelasContext } from '../context/kelas_context'
import { usePostContext } from '../context/post_context'
import { collect } from 'collect.js'



export default function CardCreatePost() {
    return (
        <Box shadow={'md'} rounded={'base'} border='1px' borderColor='gray.200'>
            <Tabs>
                <TabList>
                    <Tab>Diskusi</Tab>
                    <Tab>Materi</Tab>
                    <Tab>Tugas</Tab>
                    <Tab>Latihan</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <FormDiskusi />
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                        <p>three!</p>
                    </TabPanel>
                    <TabPanel>
                        <p>three!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

const FormDiskusi = () => {
    const post = usePostContext();

    const [form, setForm] = useState({ kelas_id: '', content: '' });
    const [validateForm, setValidateForm] = useState({ kelas_id: '', content: '' });

    function setKelasId(id) {
        setForm({ ...form, kelas_id: id })
    }

    async function createPost() {
        let validateData = { kelas_id: '', content: '' };

        if (form.content == '') {
            validateData.content = 'Konten tidak boleh kosong!';
        }

        if (form.kelas_id == '') {
            validateData.kelas_id = 'Silakan pilih kelas!';
        }

        setValidateForm(validateData);

        if (collect(validateData).values().every((item) => item == '')) {
            await post.createPost(form)
            setForm({
                kelas_id: '',
                content: ''
            })
        }
    }

    return (
        <Box>
            <FormControl isInvalid={validateForm.content != ''}>
                <Textarea value={form.content} placeholder='Apa yang ingin didiskusikan?' onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </FormControl>

            <Box h={'10px'}></Box>
            <FormControl isInvalid={validateForm.kelas_id != ''}>
                <PilihKelas value={form.kelas_id} setKelasId={setKelasId} />
            </FormControl>
            <Box h={'10px'}></Box>
            <Button colorScheme='blue' onClick={createPost}>Kirim</Button>
        </Box>
    )
}

const PilihKelas = ({ value, setKelasId }) => {
    const kelas = useKelasContext();



    return (
        <Select value={value} placeholder='Pilih Kelas' onChange={(e) => setKelasId(e.target.value)}>
            {
                kelas.listKelas.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
            }
        </Select>
    )
}