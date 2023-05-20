import { useCallback, useState } from 'react';
import styles from './Editor.module.css';
import { QueryIDE } from './QueryIDE';
import { EditorTools } from './EditorTools';
import { ResponseIDE } from './ResponseIDE';
import playIcon from '@/assets/icons/play.png';
import stopIcon from '@/assets/icons/stop.png';
import { acceptCompletion, autocompletion } from '@codemirror/autocomplete';
import { Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { graphql } from 'cm6-graphql';
import { GraphQLSchema } from 'graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiController } from '@/api/apiController';
import { AxiosError } from 'axios';
import { IApiResponseError } from '@/types/interfaces/IApiResponseError';
import { IApiResponse } from '@/types/interfaces/IApiRespose';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { ErrorFallback } from '@/components/BasicComponents/ErrorFallback';

const extensions = (schema?: GraphQLSchema) => [
  graphql(schema),
  autocompletion({
    activateOnTyping: true,
    icons: true,
  }),
  Prec.high(
    keymap.of([
      {
        key: 'Tab',
        run: acceptCompletion,
      },
      {
        key: 'Mod-Enter',
        run: () => true,
      },
    ])
  ),
];

const onError = (error: Error) => {
  toast(error.message, { type: 'error' });
};

export const Editor = () => {
  const schemaResponse = useQuery(['getSchema'], apiController.getSchema);
  const { mutate, isLoading, error } = useMutation<
    IApiResponse,
    AxiosError<IApiResponseError>,
    string
  >((data) => apiController.getGraphQLResponse(data), {
    onSuccess: (response) => {
      setQueryResponse(JSON.stringify(response));
    },
    onError: (err) => {
      setQueryResponse(err.response?.data.errors[0].message ?? 'error');
    },
  });

  const [queryResponse, setQueryResponse] = useState('');
  const [query, setQuery] = useState('');
  const [variables, setVariables] = useState('');
  const [headers, setHeaders] = useState('');
  const onQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const onVariablesChange = useCallback((value: string) => {
    setVariables(value);
  }, []);

  const onHeadersChange = useCallback((value: string) => {
    setHeaders(value);
  }, []);

  const handleSubmit = () => {
    const mock = { query, variables, headers, error };
    mutate(query.trim());
    return mock;
  };
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      <div className={styles.wrapper}>
        <div className={styles.editor}>
          <div className={styles.editorWrapper}>
            <div className={styles.editorField}>
              <QueryIDE
                value=""
                placeholder="Enter your query here"
                onChange={onQueryChange}
                extensions={extensions(schemaResponse.data)}
              />
            </div>
            <div className={styles.editorButtons}>
              <button type="button" className={styles.runButton} onClick={handleSubmit}>
                {!isLoading && <img className={styles.buttonIcon} src={playIcon} alt="Run" />}
                {isLoading && <img className={styles.buttonIcon} src={stopIcon} alt="Stop" />}
              </button>
            </div>
          </div>
          <EditorTools onVariablesChange={onVariablesChange} onHeadersChange={onHeadersChange} />
        </div>
        <div className={styles.resronse}>
          <ResponseIDE value={queryResponse} />
        </div>
      </div>
    </ErrorBoundary>
  );
};
