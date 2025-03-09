import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileTextIcon,
  PrinterIcon,
  SearchIcon,
  PlusIcon,
  DownloadIcon,
  FileIcon
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  number: string;
  customer: string;
  date: string;
  value: number;
  status: string;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState("nfe");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar documentos do localStorage
    const savedDocs = localStorage.getItem('pauloCell_documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);

  const handleNewDocument = (type: string) => {
    // Implementar lógica de criação de novo documento
    toast.success(`Iniciando emissão de ${type.toUpperCase()}`);
  };

  const documentTypes = {
    nfe: "Nota Fiscal Eletrônica (NF-e)",
    nfce: "Nota Fiscal de Consumidor (NFC-e)",
    nfse: "Nota Fiscal de Serviço (NFS-e)"
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documentos Fiscais</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <SearchIcon className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </div>

        <Tabs defaultValue="nfe" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nfe">NF-e</TabsTrigger>
            <TabsTrigger value="nfce">NFC-e</TabsTrigger>
            <TabsTrigger value="nfse">NFS-e</TabsTrigger>
          </TabsList>

          {Object.entries(documentTypes).map(([key, title]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>
                    Gerencie suas notas fiscais de forma simples e rápida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <Button onClick={() => handleNewDocument(key)}>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Emitir {key.toUpperCase()}
                        </Button>
                        <Button variant="outline">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Exportar
                        </Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents
                          .filter(doc => doc.type === key)
                          .map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.number}</TableCell>
                              <TableCell>{doc.customer}</TableCell>
                              <TableCell>{doc.date}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(doc.value)}
                              </TableCell>
                              <TableCell>{doc.status}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon">
                                    <PrinterIcon className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <DownloadIcon className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default Documents; 