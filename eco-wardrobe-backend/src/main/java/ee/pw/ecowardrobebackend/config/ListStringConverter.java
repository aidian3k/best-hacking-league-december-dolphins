package ee.pw.ecowardrobebackend.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Converter(autoApply = false)
public class ListStringConverter implements AttributeConverter<List<String>, String> {
    private static final String SEP = "||";

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) return null;
        return attribute.stream()
                .map(s -> s == null ? "" : s)
                .collect(Collectors.joining(SEP));
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return Collections.emptyList();
        return Arrays.stream(dbData.split(java.util.regex.Pattern.quote(SEP)))
                .map(s -> s.isEmpty() ? null : s)
                .collect(Collectors.toList());
    }
}

